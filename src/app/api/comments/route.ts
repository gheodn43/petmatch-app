import { NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  BatchGetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid"; // Để tạo UUID cho comment

const dynamoDB = new DynamoDBClient({});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json(
      { error: "Thiếu blogId trong yêu cầu" },
      { status: 400 }
    );
  }

  try {
    // 1. Lấy danh sách các comment theo blogId
    const commentCommand = new QueryCommand({
      TableName: "petmatch-comments",
      KeyConditionExpression: "blog_id = :blogId",
      ExpressionAttributeValues: {
        ":blogId": { S: blogId },
      },
    });

    const commentResponse = await dynamoDB.send(commentCommand);

    if (!commentResponse.Items || commentResponse.Items.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. Lấy tất cả `authorId` từ các comment
    const authorIds = Array.from(
      new Set(commentResponse.Items.map((item) => item.author_id?.S || "")).values()
    ).filter((id) => id !== "");

    if (authorIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 3. Sử dụng `BatchGetItemCommand` để lấy thông tin người dùng từ bảng `petmatch-users`
    const batchGetCommand = new BatchGetItemCommand({
      RequestItems: {
        'petmatch-users': {
          Keys: authorIds.map((authorId) => ({ user_id: { S: authorId } })), // Chỉ dùng `user_id` làm Partition Key
          ProjectionExpression: 'user_id, user_name', // Lấy các trường `user_id` và `name`
        },
      },
    });

    const batchGetResponse = await dynamoDB.send(batchGetCommand);


    if (!batchGetResponse.Responses || !batchGetResponse.Responses["petmatch-users"]) {
      throw new Error("Không thể lấy dữ liệu người dùng");
    }

    // 4. Tạo `userMap` từ kết quả `BatchGetItemCommand`
    const userMap: { [key: string]: string } = {};
    for (const user of batchGetResponse.Responses["petmatch-users"]) {
      if (user.user_id?.S && user.user_name?.S) {
        userMap[user.user_id.S] = user.user_name.S;
      }
    }

    // 5. Kết hợp dữ liệu `authorName` vào từng comment
    const comments = commentResponse.Items.map((item) => ({
      commentId: item.comment_id?.S || "",
      blogId: item.blog_id?.S || "",
      authorId: item.author_id?.S || "",
      authorName: userMap[item.author_id?.S || ""] || "Unknown User",
      content: item.content?.S || "",
      createdAt: item.created_at?.S || "",
    }));

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu comment" },
      { status: 500 }
    );
  }
}

// Hàm POST để tạo comment mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blogId, authorId, content } = body;

    if (!blogId || !authorId || !content) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết trong yêu cầu" },
        { status: 400 }
      );
    }

    const commentId = uuidv4(); // Tạo ID duy nhất cho comment
    const createdAt = new Date().toISOString(); // Thời gian tạo

    // Tạo đối tượng comment để lưu vào DynamoDB
    const newComment = {
      commentId,
      blogId,
      authorId,
      content,
      createdAt,
    };

    // Lệnh PutItemCommand để lưu comment mới vào DynamoDB
    const command = new PutItemCommand({
      TableName: "petmatch-comments",
      Item: {
        comment_id: { S: commentId },
        blog_id: { S: blogId },
        author_id: { S: authorId },
        content: { S: content },
        created_at: { S: createdAt },
      },
    });

    // Gửi lệnh lên DynamoDB
    await dynamoDB.send(command);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Không thể tạo comment mới" },
      { status: 500 }
    );
  }
}

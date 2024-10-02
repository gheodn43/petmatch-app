export interface Blog {
    blogId : string;
    title : string;
    category : string;
    content : string;
    imageUrl? : string[];
    authorId : string;
    createdAt : string;
}

export interface Comment{
    commentId : string;
    blogId : string;
    authorId : string;
    content : string;
    createdAt : string;
    authorName?: string;
}
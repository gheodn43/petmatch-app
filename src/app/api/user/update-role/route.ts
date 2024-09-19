import { getUserIdFromCookie } from '@/utils/authUtils';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userIdOrResponse = await getUserIdFromCookie(request);
    if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
    const user_id = userIdOrResponse;

    const { orderCode } = await request.json();
    if (!orderCode) {
      return NextResponse.json({ message: 'orderCode is required' }, { status: 400 });
    }
    console.log('Received orderCode:', orderCode);


    //const { packageName } = paymentInfo;
    const packageName = 'Premium';
    // let newRole;
    // switch (packageName) {
    //   case 'VIP':
    //     newRole = 'VIP';
    //     break;
    //   case 'Gold':
    //     newRole = 'Gold';
    //     break;
    //   case 'Premium':
    //     newRole = 'Premium';
    //     break;
    //   default:
    //     return NextResponse.json({ message: 'packageName không hợp lệ' }, { status: 400 });
    // }

   // console.log('New Role:', newRole);

    return NextResponse.json({ message: 'Role updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error updating role' }, { status: 500 });
  }
}

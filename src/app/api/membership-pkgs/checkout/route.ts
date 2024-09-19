import { NextResponse, NextRequest } from 'next/server';
import { getUserIdFromCookie } from '@/utils/authUtils';
import PayOS from '@/lib/payos';

export async function POST(req: NextRequest) {
    try {
        const userIdOrResponse = await getUserIdFromCookie(req);
        if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
        const user_id = userIdOrResponse;
        const DOMAIN = process.env.DOMAIN;
        const { package: packageName } = await req.json();
        if (!['VIP', 'Gold', 'Premium'].includes(packageName)) {
            return NextResponse.json({ error: 'Tên gói thành viên không khả dụng.' }, { status: 400 });
        }
        let amount;
        switch (packageName) {
            case 'VIP':
                amount = 3900;
                break;
            case 'Gold':
                amount = 4900;
                break;
            case 'Premium':
                amount = 5900;
                break;
            default:
                amount = 0;
                break;
        }
        const body = {
            orderCode: Number(String(Date.now()).slice(-6)),
            amount: amount,
            description: `THANH TOAN GOI ${packageName}`,
            returnUrl: `${DOMAIN}/home`,
            cancelUrl: `${DOMAIN}/membership-pkgs`
        };

        // Tạo liên kết thanh toán
        let paymentLinkResponse;
        try {
            paymentLinkResponse = await PayOS.createPaymentLink(body);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Có lỗi xảy ra khi tạo liên kết thanh toán.' }, { status: 500 });
        }

        const paymentLink = paymentLinkResponse.checkoutUrl;
        return NextResponse.json({ paymentLink }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}

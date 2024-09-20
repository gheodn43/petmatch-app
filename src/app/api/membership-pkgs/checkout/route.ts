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

        if (!['VIP', 'Premium'].includes(packageName)) {
            return NextResponse.json({ error: 'Tên gói thành viên không khả dụng.' }, { status: 400 });
        }

        let amount;
        switch (packageName) {
            case 'VIP':
                amount = 10000;
                break;
            case 'Premium':
                amount = 20000;
                break;
            default:
                amount = 0;
                break;
        }

        const body = {
            orderCode: Number(String(Date.now()).slice(-6)),
            amount: amount,
            description: `THANH TOAN GOI ${packageName}`,
            returnUrl: `${DOMAIN}/membership-pkgs/payment-success`,
            cancelUrl: `${DOMAIN}/membership-pkgs`
        };

        let paymentLinkResponse;
        try {
            paymentLinkResponse = await PayOS.createPaymentLink(body);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Có lỗi xảy ra khi tạo liên kết thanh toán.' }, { status: 500 });
        }

        const paymentLink = paymentLinkResponse.checkoutUrl;
        const orderCode = paymentLinkResponse.orderCode;
        const response = NextResponse.json({ paymentLink, orderCode, packageName }, { status: 200 });
        response.cookies.set('payment_info', JSON.stringify({ orderCode, packageName }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 120,
        });

        return response;
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}

'use client';

import Link from 'next/link';
export default function MenbershipPkgs() {
    return (
        <div>
            <p>this page page will be show packages, when we click  one of them, direct to payment page have link 'membership-pkgs/payment'</p>
            <Link href="membership-pkgs/payment">
                <button className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Go to Payment
                </button>
            </Link>
        </div>
    )
}
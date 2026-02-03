import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const Success: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
            <div className="bg-white p-12 max-w-lg w-full text-center shadow-2xl border border-gray-100">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-4xl font-serif italic mb-4 text-[#273134]">Payment Successful</h1>
                <p className="text-gray-500 italic mb-10 leading-relaxed">
                    Thank you for supporting handmade. Your order has been confirmed and the artisan has been notified.
                </p>
                <Link
                    to="/shop"
                    className="bg-[#273134] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-black transition-all inline-flex items-center"
                >
                    Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

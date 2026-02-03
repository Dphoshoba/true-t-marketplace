import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export const Cancel: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
            <div className="bg-white p-12 max-w-lg w-full text-center shadow-2xl border border-gray-100">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-4xl font-serif italic mb-4 text-[#273134]">Payment Cancelled</h1>
                <p className="text-gray-500 italic mb-10 leading-relaxed">
                    Your payment was not processed. No charges were made. You can return to the shop whenever you're ready.
                </p>
                <Link
                    to="/shop"
                    className="border-b border-[#273134] pb-1 text-[#273134] uppercase tracking-widest text-xs font-bold hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all inline-flex items-center"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Return to Shop
                </Link>
            </div>
        </div>
    );
};

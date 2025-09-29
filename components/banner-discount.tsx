import React from 'react';

interface BannerDiscountProps {
    message?: string;
    discount?: number;
}

const BannerDiscount: React.FC<BannerDiscountProps> = ({
    message = 'Get amazing discounts!',
    discount = 20,
}) => {
    return (
        <div style={{
            background: '#ffe0b2',
            padding: '1rem',
            borderRadius: '0px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#d81515ff',
        }}>
            {message} Save up to {discount}%!
        </div>
    );
};

export default BannerDiscount; 
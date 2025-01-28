import React, { useState } from 'react';
import { 
    BsGift, 
    BsCoin, 
    BsHeart, 
    BsStar, 
    BsGem, 
    BsEmojiSmile, 
    BsFlower1,
    BsTrophy 
} from 'react-icons/bs';
import './GiftsModal.css';

const gifts = [
    {
        id: 1,
        name: "Сердечко",
        icon: <BsHeart />,
        price: 10,
        description: "Покажите свою симпатию"
    },
    {
        id: 2,
        name: "Звезда",
        icon: <BsStar />,
        price: 25,
        description: "Яркий знак внимания"
    },
    {
        id: 3,
        name: "Трофей",
        icon: <BsTrophy />,
        price: 50,
        description: "Королевский подарок"
    },
    {
        id: 4,
        name: "Бриллиант",
        icon: <BsGem />,
        price: 100,
        description: "Самый ценный подарок"
    },
    {
        id: 5,
        name: "Цветок",
        icon: <BsFlower1 />,
        price: 15,
        description: "Виртуальный букет"
    },
    {
        id: 6,
        name: "Улыбка",
        icon: <BsEmojiSmile />,
        price: 5,
        description: "Поделитесь позитивом"
    }
];

function GiftsModal({ onClose, userBalance = 1000, onSendGift }) {
    const [selectedGift, setSelectedGift] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleGiftSelect = (gift) => {
        setSelectedGift(gift);
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        if (selectedGift && userBalance >= selectedGift.price) {
            onSendGift(selectedGift);
            setShowConfirmation(false);
            setSelectedGift(null);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal gifts-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2><BsGift /> Подарки</h2>
                    <div className="balance">
                        <BsCoin /> {userBalance} RC
                    </div>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="gifts-content">
                    <div className="gifts-grid">
                        {gifts.map(gift => (
                            <div 
                                key={gift.id} 
                                className={`gift-item ${selectedGift?.id === gift.id ? 'selected' : ''} ${userBalance < gift.price ? 'disabled' : ''}`}
                                onClick={() => userBalance >= gift.price && handleGiftSelect(gift)}
                            >
                                <div className="gift-icon">{gift.icon}</div>
                                <div className="gift-name">{gift.name}</div>
                                <div className="gift-price">
                                    <BsCoin /> {gift.price}
                                </div>
                                <div className="gift-description">{gift.description}</div>
                            </div>
                        ))}
                    </div>

                    {showConfirmation && selectedGift && (
                        <div className="gift-confirmation">
                            <div className="confirmation-content">
                                <div className="selected-gift">
                                    <div className="gift-icon large">{selectedGift.icon}</div>
                                    <div className="gift-details">
                                        <div className="gift-name">{selectedGift.name}</div>
                                        <div className="gift-price">
                                            <BsCoin /> {selectedGift.price} RC
                                        </div>
                                    </div>
                                </div>
                                <div className="confirmation-buttons">
                                    <button 
                                        className="confirm-button"
                                        onClick={handleConfirm}
                                    >
                                        Отправить подарок
                                    </button>
                                    <button 
                                        className="cancel-button"
                                        onClick={() => setShowConfirmation(false)}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GiftsModal; 
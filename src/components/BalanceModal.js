import React, { useState } from 'react';
import { BsCoin, BsCreditCard2Front, BsWallet2, BsCashStack, BsArrowRepeat } from 'react-icons/bs';
import CurrencyService from '../services/CurrencyService';
import './BalanceModal.css';

const AMOUNTS = [
    { rubles: 100, coins: 200 },
    { rubles: 500, coins: 1000 },
    { rubles: 1000, coins: 2000 },
    { rubles: 2000, coins: 4000 },
    { rubles: 5000, coins: 10000 }
];

function BalanceModal({ onClose, currentBalance, onBalanceUpdate }) {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    const handleTopUp = async () => {
        const amount = selectedAmount?.rubles || Number(customAmount);
        if (!amount) return;

        setIsProcessing(true);
        try {
            // Здесь будет интеграция с платежной системой
            const newBalance = CurrencyService.addFunds(amount);
            onBalanceUpdate(newBalance);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error processing payment:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal balance-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2><BsWallet2 /> Баланс</h2>
                    <div className="current-balance">
                        <BsCoin /> {currentBalance} RC
                    </div>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="balance-content">
                    <div className="exchange-rate-info">
                        <div className="exchange-rate-card">
                            <div className="exchange-icon">
                                <BsArrowRepeat />
                            </div>
                            <div className="exchange-text">
                                <div className="exchange-title">Курс обмена</div>
                                <div className="exchange-rate">1₽ = 2 RC(RuletCoin)</div>
                            </div>
                        </div>
                    </div>

                    <div className="amount-grid">
                        {AMOUNTS.map((amount) => (
                            <div
                                key={amount.rubles}
                                className={`amount-item ${selectedAmount === amount ? 'selected' : ''}`}
                                onClick={() => handleAmountSelect(amount)}
                            >
                                <div className="amount-rubles">{amount.rubles}₽</div>
                                <div className="amount-coins">
                                    <BsCoin /> {amount.coins} RC
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="custom-amount">
                        <div className="custom-amount-input">
                            <input
                                type="text"
                                placeholder="Другая сумма"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                            />
                            <span className="currency-label">₽</span>
                        </div>
                        <div className="custom-amount-coins">
                            {customAmount && (
                                <><BsCoin /> {Number(customAmount) * 2} RC</>
                            )}
                        </div>
                    </div>

                    <div className="payment-methods">
                        <h3>Способ оплаты</h3>
                        <div className="payment-grid">
                            <div className="payment-method active">
                                <BsCreditCard2Front />
                                <span>Банковская карта</span>
                            </div>
                            <div className="payment-method disabled">
                                <BsCashStack />
                                <span>Другие способы</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className={`top-up-button ${isProcessing ? 'processing' : ''} ${showSuccess ? 'success' : ''}`}
                        onClick={handleTopUp}
                        disabled={!selectedAmount && !customAmount}
                    >
                        {isProcessing ? 'Обработка...' : showSuccess ? 'Успешно!' : 'Пополнить баланс'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BalanceModal; 
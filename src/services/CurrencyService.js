class CurrencyService {
    constructor() {
        this.EXCHANGE_RATE = 2; // 1 RUB = 2 RuleCoin (RC)
        this.balance = this.getBalance();
    }

    // Получить текущий баланс
    getBalance() {
        const savedBalance = localStorage.getItem('ruleCoinBalance');
        return savedBalance ? parseInt(savedBalance) : 0;
    }

    // Сохранить баланс
    saveBalance(amount) {
        localStorage.setItem('ruleCoinBalance', amount.toString());
        this.balance = amount;
    }

    // Пополнить баланс (в рублях)
    addFunds(rubles) {
        const coins = rubles * this.EXCHANGE_RATE;
        const newBalance = this.balance + coins;
        this.saveBalance(newBalance);
        return newBalance;
    }

    // Списать монеты
    spendCoins(amount) {
        if (this.balance < amount) {
            throw new Error('Недостаточно средств');
        }
        const newBalance = this.balance - amount;
        this.saveBalance(newBalance);
        return newBalance;
    }

    // Проверить, достаточно ли средств
    canAfford(amount) {
        return this.balance >= amount;
    }

    // Получить историю транзакций
    getTransactionHistory() {
        const history = localStorage.getItem('transactionHistory');
        return history ? JSON.parse(history) : [];
    }

    // Добавить транзакцию в историю
    addTransaction(type, amount, description) {
        const history = this.getTransactionHistory();
        const transaction = {
            type,
            amount,
            description,
            timestamp: new Date().toISOString()
        };
        history.push(transaction);
        localStorage.setItem('transactionHistory', JSON.stringify(history));
    }

    // Конвертировать рубли в монеты
    convertRublesToCoins(rubles) {
        return rubles * this.EXCHANGE_RATE;
    }

    // Конвертировать монеты в рубли
    convertCoinsToRubles(coins) {
        return coins / this.EXCHANGE_RATE;
    }
}

export default new CurrencyService(); 
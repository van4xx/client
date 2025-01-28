import React, { useState } from 'react';
import { BsLightningFill, BsArrowRepeat } from 'react-icons/bs';
import './IcebreakerModal.css';

const topics = [
    // Общие темы
    "Какое твое любимое время года и почему?",
    "Если бы ты мог путешествовать в любую страну прямо сейчас, куда бы ты отправился?",
    "Какой твой любимый фильм и почему он тебе нравится?",
    "Что бы ты сделал, если бы выиграл миллион?",
    "Какая твоя самая заветная мечта?",
    
    // Забавные
    "Если бы ты мог иметь любую суперспособность, какую бы выбрал?",
    "Какое самое странное блюдо ты когда-либо пробовал?",
    "Если бы ты мог поменяться жизнью с любым человеком на один день, кого бы ты выбрал?",
    "Какой самый нелепый случай произошел с тобой в общественном месте?",
    
    // Творческие
    "Если бы ты мог создать новый праздник, каким бы он был?",
    "Какие три вещи ты бы взял с собой на необитаемый остров?",
    "Если бы ты мог изобрести что-то новое, что бы это было?",
    
    // Глубокие
    "Что для тебя означает счастье?",
    "Какой самый важный урок ты получил в жизни?",
    "Что бы ты хотел изменить в мире?",
    
    // Развлекательные
    "Какая твоя любимая настольная игра?",
    "Какой последний концерт ты посетил?",
    "Какой твой любимый способ проводить выходные?",
    
    // Технологии
    "Какими приложениями ты пользуешься чаще всего?",
    "Как ты думаешь, как будет выглядеть мир через 50 лет?",
    
    // Хобби
    "Есть ли у тебя необычное хобби?",
    "Какой навык ты всегда хотел освоить?",
    
    // Еда
    "Какое твое любимое блюдо?",
    "Если бы ты мог есть только одно блюдо всю жизнь, что бы это было?"
];

function IcebreakerModal({ onClose }) {
    const [currentTopic, setCurrentTopic] = useState(getRandomTopic());

    function getRandomTopic() {
        return topics[Math.floor(Math.random() * topics.length)];
    }

    const handleNewTopic = () => {
        setCurrentTopic(getRandomTopic());
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal icebreaker-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2><BsLightningFill /> Ледокол</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="icebreaker-content">
                    <div className="topic-container">
                        <div className="topic-text">
                            {currentTopic}
                        </div>
                    </div>
                    <button className="new-topic-button" onClick={handleNewTopic}>
                        <BsArrowRepeat /> Новая тема
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IcebreakerModal; 
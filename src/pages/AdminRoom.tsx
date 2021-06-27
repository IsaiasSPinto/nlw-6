import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import deleteImg from '../assets/images/delete.svg'
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/button';
import { Question } from '../components/question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';
import '../styles/question.scss'
import { useRoom } from '../hooks/useRoom';


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('');
    const {title , questions} = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
        
    }


    async function handleDeleteQuestion(questionId: string) {
       if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }
   
    async function handleCreateNewQuestion(event: FormEvent) {
        event.preventDefault()

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user.avatar,
            },
            isHighlighted:false,
            isAnswered: false, 
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('')
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo let me ask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button  isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>


                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}                         
                            >
                             <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                             >
                                 <img src={deleteImg} alt="Remover pergunta" />
                             </button>
                            </Question>  
                        )
                    })}
                </div>
            </main>
        </div>
    );
}
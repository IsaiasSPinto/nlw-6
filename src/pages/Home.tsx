import { useHistory } from 'react-router-dom';

import { auth, firebase , database } from '../services/firebase'


import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss';
import { Button } from '../components/button';

export function Home() {
    const history = useHistory();

    function handleCreateRoom() {
        const provider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(provider).then(result => {
            console.log(result);

            history.push('/rooms/new')
        })

        
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q and A ao vivo</strong>
                <p>Tire suas dúvidas em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Let me ask logo" />
                    <button onClick = {handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </ Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
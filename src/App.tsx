import styles from './App.module.css';
import { useState } from 'react';

import Modal from './components/Modal';
import PetitionUpdateForm from './components/PetitionUpdateForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <button className={styles.toggleModal} onClick={() => setIsModalOpen(true)}>
        Update Petition
      </button>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} children={<PetitionUpdateForm />} />}
    </main>
  )
}

export default App

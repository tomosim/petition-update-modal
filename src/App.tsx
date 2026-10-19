import styles from './App.module.css';
import { useState } from 'react';

import Modal from './components/Modal';
import PetitionUpdateForm from './components/PetitionUpdateForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <button className={styles.toggleModal} onClick={() => setIsModalOpen(true)}>
        Update Petition
      </button>
      {isModalOpen && <Modal ariaLabel="Update Petition" ariaLabelledBy="update-petition-title" children={<PetitionUpdateForm title="Neues Update erstellen" onClose={() => console.log("Close button clicked")} />} />}
    </main>
  )
}

export default App

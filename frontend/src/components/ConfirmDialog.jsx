import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Please confirm" onClose={onCancel}>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn btn-light" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

import { useEffect, useState } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Modal } from 'flowbite-react';
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";

export default function Notes({ setShowModal, showModal, id, name }) {

  const [noteChange, setNoteChange] = useState('');
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/note/getNotes/${id}`);
      if (!res.ok) throw new Error('Failed to fetch notes.');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNotes();
    }
  }, [id]);

  const handleSaveNote = async () => {
    try {
      if (!noteChange.trim()) {
        toast.error("Note content is required");
        return;
      }

      const res = await fetch(`/api/note/createNote/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteChange }),
      });

      if (!res.ok) throw new Error('Failed to save note.');

      await fetchNotes();
      setShowModal(false);
      setNoteChange('');
      toast.success('Note added successfully');
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to save note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await fetch(`/api/note/deleteNote/${noteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete note.');

      await fetchNotes();
      toast.success('Note deleted successfully');
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete note');
    }
  };

  return (
    <div>
      <div className='w-full flex justify-end'>
        <button className='bg-gray-700 rounded-md px-3 py-2 text-sm text-white hover:bg-gray-900 transition-colors duration-150' onClick={() => setShowModal(true)}>
          Create Note
        </button>
      </div>

      {/* Notes List */}
      {notes.length > 0 ? ( notes.map((note) => (
        <div key={note.id} className='bg-white shadow-md rounded-md p-3 md:p-5 mt-5 border'>
          <div className="flex flex-col md:items-center md:justify-between md:flex-row-reverse">
            <div className="flex items-center gap-2">
              <p className='text-xs text-gray-700'>
                {new Date(note.created_at).toUTCString()}
              </p>
              <button className="bg-red-500 text-white px-1 py-1 rounded-md hover:bg-red-600 text-xs transition-colors duration-150" onClick={() => handleDeleteNote(note.id)} title='Delete Note'>
                <MdDelete />
              </button>
            </div>
            <p className='text-gray-800 text-sm flex gap-1 items-center mt-2 md:mt-0'>
              <MdKeyboardArrowRight className='text-lg' />
              Note for <span className='font-semibold capitalize'>{name}</span>
            </p>
          </div>
          <p className='text-gray-800 text-sm pl-[21px] mt-3'>{note.note_content}</p>
        </div>
        ))
        ) : (
        <p className='text-gray-500 mt-5'>No notes available</p>
      )}

      {/* Flowbite Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>Create Note</Modal.Header>
        <Modal.Body>
          <textarea className="w-full h-32 border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 p-2" placeholder="Write your note here..." value={noteChange} onChange={(e) => setNoteChange(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-150" onClick={handleSaveNote}>
            Save
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-150" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

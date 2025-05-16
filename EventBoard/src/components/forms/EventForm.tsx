import { useState } from 'react';

export default function EventForm({ onSubmit }: { onSubmit: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, desc);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="설명" />
      <button type="submit">등록</button>
    </form>
  );
}

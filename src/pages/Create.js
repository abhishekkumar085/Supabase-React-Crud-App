import { useState } from 'react';
import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    method: '',
    rating: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.method || !formData.rating) {
      setFormError('All fields are required');
      return;
    }

    const { data, error } = await supabase.from('smoothies').insert(
      [
        {
          title: formData.title,
          method: formData.method,
          rating: formData.rating,
        },
      ],
      { returning: 'representation' }
    );
    if (error) {
      console.log(error);
      setFormError('something went wrong!!', error);
    } else {
      console.log('Data inserted successfully:', data);
      setFormData({
        title: '',
        method: '',
        rating: '',
      });
      navigate('/');
    }
  };

  return (
    <div className="page create">
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          value={formData.title}
          id="title"
          name="title"
          required
          onChange={handleChange}
        />
        <label htmlFor="method">Method</label>
        <input
          type="text"
          value={formData.method}
          id="method"
          name="method"
          required
          onChange={handleChange}
        />
        <label htmlFor="rating">Rating</label>
        <input
          type="number"
          value={formData.rating}
          id="rating"
          name="rating"
          required
          onChange={handleChange}
        />

        <button type="submit">Add Smoothie</button>
        <p className="error">{formError}</p>
      </form>
    </div>
  );
};

export default Create;

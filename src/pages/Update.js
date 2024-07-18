import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const Update = () => {
  const { id } = useParams();
  const navgate = useNavigate();
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

    const { data, error } = await supabase
      .from('smoothies')
      .update({
        title: formData.title,
        method: formData.method,
        rating: formData.rating,
      })
      .eq('id', id)
      .select();

    if (error) {
      setFormError('something went wrong!!', error);
      console.log(error);
    } else {
      console.log(data);
      setFormError(null);
      navgate('/');
    }
  };
  useEffect(() => {
    const fetchSingleSmoothies = async () => {
      const { data, error } = await supabase
        .from('smoothies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        navgate('/', { replace: true });
      }
      if (data) {
        setFormData({
          title: data.title,
          method: data.method,
          rating: data.rating,
        });
        console.log(data);
      }
    };
    fetchSingleSmoothies();
  }, [id, navgate]);
  return (
    <div className="page update">
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

        <button type="submit">Update Smoothie</button>
        {/* <p className="error">{formError}</p> */}
      </form>
    </div>
  );
};

export default Update;

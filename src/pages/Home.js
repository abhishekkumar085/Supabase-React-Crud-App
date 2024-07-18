import { useState } from 'react';
import supabase from '../config/supabaseClient';
import { useEffect } from 'react';
import SmoothieCard from '../components/SmoothieCard';

const Home = () => {
  console.log(supabase);
  const [fetchdata, setFetchData] = useState(null);
  const [fetcherror, setFetchError] = useState(null);
  const [orderBy,setOrderBy]=useState('created_at')

  const handleDelete = (id) => {
    setFetchData((prev) => prev.filter((sm) => sm.id !== id));
  };

  const fetchSmoothies = async () => {
    const { data, error } = await supabase.from('smoothies').select().order(orderBy,{ascending:false});
    if (error) {
      setFetchError('Something went wrong', error);
      setFetchData(null);
      console.log(error);
    }
    if (data) {
      setFetchData(data);
      setFetchError(null);
      console.log(data);
    }
  };
  useEffect(() => {
    fetchSmoothies();
  }, []);
  return (
    <div className="page home">
      {fetcherror && <p>{fetcherror}</p>}
      {fetchdata && (
        <div className="smoothies">
        <div className="order-by">
          <p>Order by :- </p>
          <button onClick={()=>setOrderBy('created_at')}>Time created</button>
          <button onClick={()=>setOrderBy('title')}>Title</button>
          <button onClick={()=>setOrderBy('rating')}>Rating</button>
          {orderBy}
        </div>
          <div className="smoothie-grid">
            {fetchdata.map((smoothie) => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} onDelete={handleDelete}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

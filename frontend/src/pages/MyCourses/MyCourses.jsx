import React, { useEffect, useState } from 'react';
import './MyCourses.css';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) { setError('Please login'); setLoading(false); return; }
        const res = await fetch('/api/user/student/my-courses', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data?.courses) { setItems(data.courses); } else { setError(data.message || 'Failed to load'); }
      } catch (e) { setError('Failed to load'); }
      finally { setLoading(false); }
    };
    run();
  }, []);

  if (loading) return <div className="mc-wrapper"><p>Loading...</p></div>;
  if (error) return (
    <div className="mc-wrapper">
      <p className="mc-error">{error}</p>
      <button className="mc-browse" onClick={() => navigate('/')}>Browse Courses</button>
    </div>
  );

  if (!items.length) return (
    <div className="mc-wrapper">
      <h3>No courses yet</h3>
      <button className="mc-browse" onClick={() => navigate('/')}>Browse Courses</button>
    </div>
  );

  return (
    <div className="mc-grid">
      {items.map((c) => {
        const course = c.courseId || c; // populated or id
        const id = course?._id || c._id;
        return (
          <div className="mc-card" key={c._id || id}>
            <div className="mc-thumb" />
            <div className="mc-title">{course?.name || 'Course'}</div>
            <div className="mc-status">unlocked</div>
            <button className="mc-start" onClick={() => navigate(`/student/course/${id}`)}>Start Learning</button>
          </div>
        );
      })}
    </div>
  );
};

export default MyCourses;

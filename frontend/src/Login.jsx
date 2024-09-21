import { useState } from 'react';
import EventsPage from './EventsPage';

function App() {
  const [userId, setUserId] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginState, setLoginState] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Assume login is successful (you can integrate Firebase Auth or any authentication service)
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <EventsPage userId={userId} />
      ) : (
        <div className='h-screen flex justify-center items-center'>
          <form onSubmit={handleLogin} className='min-w-[400px] border border-slate-500 rounded-lg p-4 shadow-lg'>
            <h1 className='text-3xl font-bold'>{loginState ? 'Login' : 'Register'}</h1>
            <div className="divider my-1"></div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Enter Email</span>
              </div>
              <input type="text"
                placeholder="Enter Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" />

              <div className="label">
                <span className="label-text">Enter Password</span>
              </div>
              <input type="password"
                placeholder="Enter Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" />
            </label>
            <span className='text-xs mt-1 cursor-pointer hover:underline' href="#" onClick={() => setLoginState(!loginState)}> Didn&apos;t have a account? </span>
            <button type="submit" className='btn mt-4 min-w-full'>{loginState ? 'Login' : 'Register'}</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;

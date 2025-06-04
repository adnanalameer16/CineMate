import './App.css';

function App() {
  return (
    <div className="landing">
      <header className="hero">
        <div className='right'>
          <button>home</button>
          <button>contact</button>
        </div>
        <div className='left'>
          <img src="logo" alt="logo" />
        </div>
      </header>
      <section className='main'>
        <div>CINEMATE</div>
        <div>YOUR DAILY DOSE OF CINEMA</div>
        <button>login</button>
      </section>
      <footer className="footer">
        <p>© 2025 Cinemate. Built with ❤️ by Adnan</p>
      </footer>
    </div>
  );
}

export default App;

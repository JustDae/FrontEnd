import './App.css';

function App() {
  return (
    <div className="pagina">
      <section className="inicio" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/principal.png')` }}>
        
        <nav className="barra">
          <div className="nombre">El Rincón del Sabor</div>
          <div className="enlaces">
            <a href="#inicio">Inicio</a>
            <a href="#comida">Menú</a>
            <a href="/login" className="boton-admin">Entrar</a>
          </div>
        </nav>

        <div className="centro">
          <div className="cuadro-texto">
            <h1>El Rincón del Sabor</h1>
            <p>Tradición que se siente, sabor que se comparte.</p>
            <div className="grupo-botones">
              <button className="boton-naranja">Ver Menú</button>
              <button className="boton-blanco">Reservar</button>
            </div>
          </div>
        </div>
      </section>

      <section id="comida" className="seccion-comida">
        <h2>Nuestros Platos</h2>
        <div className="cuadricula">
          
          <div className="tarjeta-plato">
            <div className="foto-plato" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500")'}}></div>
            <div className="info-plato">
              <h4>Ensalada Bowl</h4>
              <p>$12.00</p>
            </div>
          </div>

          <div className="tarjeta-plato">
            <div className="foto-plato" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=500")'}}></div>
            <div className="info-plato">
              <h4>Panqueques Especiales</h4>
              <p>$8.50</p>
            </div>
          </div>

          <div className="tarjeta-plato">
            <div className="foto-plato" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500")'}}></div>
            <div className="info-plato">
              <h4>Pizza de la Casa</h4>
              <p>$15.00</p>
            </div>
          </div>

        </div>
      </section>

      <footer className="pie-pagina">
        <p>© 2025 - El Rincón del Sabor</p>
      </footer>
    </div>
  );
}

export default App;
import React from 'react';

const Home = () => {
  return (
    <div className="cover-container d-flex justify-content-center align-items-center text-center text-white bg-dark">
      <div className="cover-inner">
        <h1>JosePauloCamp</h1>
        <p className="lead">
          Bem-vindo ao JosePauloCamp! <br />
          Pule para o ar livre! <br />
          Compartilhe seus acampamentos e avaliações de todo o mundo.
        </p>
        <p className="lead">
          <a href="/campgrounds" className="btn btn-lg btn-secondary font-weight-bold border-white bg-white">
            Ver Acampamentos
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;

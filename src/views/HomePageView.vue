<script setup></script>

<template>
  <div class="container">
    <div class="title_description">Bine ați venit la Spitalul Nostru</div>
    <div class="description">
      <p>
        Ne angajăm să oferim îngrijire medicală și tratament cuprinzător
        pacienților noștri.
      </p>
      <p>
        Echipa noastră de medici, asistente și personal experimentat este
        dedicată asigurării bunăstării și confortului fiecărei persoane care ne
        trec pragul.
      </p>
      <p>
        Fie că aveți nevoie de controale de rutină, tratament specializat sau
        îngrijire de urgență, puteți avea încredere că vom furniza servicii
        medicale de înaltă calitate cu compasiune și profesionalism.
      </p>
    </div>
    <div class="services">
      <h2>Serviciile Noastre</h2>
      <div class="service">
        <strong>Fizioterapie:</strong> Serviciile noastre de fizioterapie au ca
        scop îmbunătățirea mobilității, ameliorarea durerii și îmbunătățirea
        calității generale a vieții prin planuri personalizate de tratament.
      </div>
      <div class="service">
        <strong>Kinetoterapie:</strong> Kinetoterapia se concentrează pe
        exerciții și mișcări terapeutice pentru îmbunătățirea forței,
        flexibilității și coordonării, adaptate nevoilor fiecărui pacient.
      </div>
      <div class="service">
        <strong>Ședințe Psihologice:</strong> Psihologii noștri experimentați
        oferă consiliere confidențială și ședințe de terapie pentru susținerea
        sănătății mintale și a bunăstării.
      </div>
      <div class="service">
        <strong>Consiliere Nutrițională:</strong> Nutriționiștii noștri oferă
        sfaturi și îndrumări alimentare personalizate pentru a ajuta pacienții
        să-și atingă obiectivele de sănătate și bunăstare.
      </div>
      <div class="service">
        <strong>Imagistică Diagnostică:</strong> Utilizăm tehnologie de
        imagistică de ultimă generație pentru diagnosticul precis și
        monitorizarea diferitelor afecțiuni medicale.
      </div>
      <div class="service">
        <strong>Reabilitare Cardiacă:</strong> Programul nostru de reabilitare
        cardiacă combină exercițiile, educația și consilierea privind stilul de
        viață pentru a susține sănătatea și recuperarea inimii.
      </div>
      <div class="service">
        <strong>Îngrijire Maternă:</strong> Oferim îngrijire prenatală,
        antenatală și postnatală cuprinzătoare pentru a asigura bunăstarea atât
        a mamei, cât și a bebelușului pe parcursul sarcinii.
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
  margin-top: 5vh;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 87.8vh;
}

.title_description {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #333333;
}

.description {
  font-size: 18px;
  text-align: center;
  color: #666666;
}

.services {
  text-align: center;
}

.services h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333333;
}

.service {
  margin-bottom: 10px;
  border-left: 5px solid #8b0000;
  padding-left: 10px;
}

.service:first-child {
  margin-top: 10px;
}

.service:hover {
  background-color: #f0f0f0;
}
</style>

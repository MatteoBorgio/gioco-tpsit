let numero_casuale = document.getElementById("numero_casuale");
let numeri = document.getElementById("numeri");
let tempo = document.getElementById("tempo");
let numero_casuale_estratto = 0;
let numeri_estratti = [];
let tempo_iniziale = 0;
let tempo_finale = 0;
let startTImer = document.getElementById("startButton");
let nome_giocatore = "";
let arrayTempi = [];
let tempi = document.getElementById("tempi");
tempi.innerHTML = "Tempi migliori:<br>";

let miglioriTempi = {}; // Oggetto per memorizzare il tempo migliore per ogni giocatore

let tentativiMax = 5;
let tentativiRimasti = tentativiMax;
let tentativiDiv = document.getElementById("tentativi");

function shuffleArray(array) {
    const newArray = [...array];
    let currentIndex = newArray.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex],
            newArray[currentIndex],
        ];
    }
    return newArray;
}

function inizializzaTimer() {
    tempo_iniziale = Date.now();
}

function calcolaTempo() {
    tempo_finale = Date.now() - tempo_iniziale;
    let secondi = Math.floor((tempo_finale % (1000 * 60)) / 1000).toString().padStart(2, "0");
    let millesimi = Math.floor(tempo_finale % 1000).toString().padStart(3, "0");
    tempo.innerHTML = "Tempo: " + secondi + ":" + millesimi;

    // Aggiorna solo se è il tempo migliore
    if (!(nome_giocatore in miglioriTempi) || tempo_finale < miglioriTempi[nome_giocatore]) {
        miglioriTempi[nome_giocatore] = tempo_finale;
    }
    aggiornaTempiMigliori();
}

function aggiornaTempiMigliori() {
    let testo = "Tempi migliori:<br>";
    for (let nome in miglioriTempi) {
        let t = miglioriTempi[nome];
        let secondi = Math.floor((t % (1000 * 60)) / 1000).toString().padStart(2, "0");
        let millesimi = Math.floor(t % 1000).toString().padStart(3, "0");
        testo += `${nome} - ${secondi}:${millesimi}<br>`;
    }
    tempi.innerHTML = testo;
}

function estraiNumero() {
    let numero = Math.floor(Math.random() * 100);
    return numero;
}

function estraiNumeri(numero_casuale_estratto) {
    numeri_estratti.push(numero_casuale_estratto);
    for (let i = 0; i < 9; i++) {
        let numero = estraiNumero();
        while (numeri_estratti.includes(numero) || numero === numero_casuale_estratto) {
            numero = estraiNumero();
        }
        numeri_estratti.push(numero);
    }
    numeri_estratti = shuffleArray(numeri_estratti);
    return numeri_estratti;
}

function aggiornaTentativi() {
    tentativiDiv.innerHTML = `Tentativi rimasti: ${tentativiRimasti}`;
}

function resettaGioco() {
    numeri.innerHTML = "";
    numeri_estratti = [];
    numero_casuale_estratto = 0;
    tempo_finale = 0;
    numero_casuale.innerHTML = "";
    tempo.innerHTML = "";
    aggiornaTentativi();
}

function fineTentativi() {
    alert("Hai terminato i tentativi! Ricarica la pagina o premi Inizia per riprovare.");
    tentativiRimasti = 0;
    aggiornaTentativi();
}

function grigliaGioco() {
    numero_casuale_estratto = estraiNumero();
    numero_casuale.innerHTML = numero_casuale_estratto;
    numeri_estratti = estraiNumeri(numero_casuale_estratto);
    for (let i = 0; i < numeri_estratti.length; i++) {
        let numero = document.createElement("div");
        numero.className = "numero";
        numero.innerHTML = numeri_estratti[i];
        numero.addEventListener("click", function () { 
            let numeroCliccato = parseInt(numero.innerHTML);
            if (numeroCliccato === numero_casuale_estratto) {
                calcolaTempo();
                tentativiRimasti--;
                if (tentativiRimasti > 0) {
                    aggiornaTentativi();
                    setTimeout(() => {
                        resettaGioco();
                        grigliaGioco();
                        inizializzaTimer();
                    }, 1000);
                } else {
                    fineTentativi();
                }
            } else {
                alert("Hai perso! Riprova.");
                tentativiRimasti--;
                if (tentativiRimasti > 0) {
                    aggiornaTentativi();
                    resettaGioco();
                    grigliaGioco();
                    inizializzaTimer();
                } else {
                    fineTentativi();
                }
            }
        });
        numeri.appendChild(numero);
    }
}

startTImer.addEventListener("click", function () {
    nome_giocatore = prompt("Inserisci il tuo nome:");
    if (!nome_giocatore) {
        nome_giocatore = "Giocatore"; 
    }
    tentativiRimasti = tentativiMax;
    aggiornaTentativi();
    resettaGioco();
    grigliaGioco();
    inizializzaTimer();
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        startTImer.click(); 
    }
});


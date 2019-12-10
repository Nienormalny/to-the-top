window.onload = () => {
    const gameContainer = document.getElementById('game-container');
    const livesContainer = document.getElementById('lives-container');
    const scoreContainer = document.getElementById('score-container');
    const gameContainerWidth = gameContainer.clientWidth;
    const gameContainerHeight = gameContainer.clientHeight;
    const settings = {
        rows: 3,
        columns: 3,
        lives: 3,
        score: 0,
        interval: 3000
    };
    const elements = [];
    const gridNumber = settings.rows * settings.columns;
    const gridFragment = document.createDocumentFragment();
    const livesFragment = document.createDocumentFragment();

    for (let i = 0; i < gridNumber; i++) {
        const gridElement = document.createElement('div');
        gridElement.classList.add('grid');
        gridElement.style.height = ((gameContainerWidth / 3) - 20) + 'px';
        gridFragment.appendChild(gridElement);
    }

    gameContainer.append(gridFragment);
    const grids = Array.from(document.querySelectorAll('.grid'));

    let lastClickedZenon = 0;
    let lastRandom = 0;
    let randomIndex = 0;

    const getRandomNumber = number => {
        let randomNumber = Math.floor(Math.random() * number);
        // if (lastRandom !== randomNumber) {
        //     lastRandom = randomNumber;
        //     return lastRandom;
        // } else {
        //     getRandomNumber(number);
        // }
        lastRandom = randomNumber;
        return randomNumber;
    };

    const zenon = (width, height, color, index, multiply) => {
        const fragment = document.createDocumentFragment();
        const zenek = document.createElement('div');
        
        zenek.classList.add('zenek');
        zenek.dataset.index = index;
        zenek.style.background = color;
        zenek.style.height = height + 'px';
        zenek.style.width = width + 'px';

        return fragment.appendChild(zenek);
    }
    let clicked = false;
    const renderElement = (index) => {
        const element = zenon(grids[0].offsetWidth / 2, grids[0].offsetHeight / 2, 'white', index);
        grids[index].append(element);
    }

    setInterval(() => {
        if (!clicked) {
            for (let el = 0; el < elements.length; el++) {
                grids[elements[el]].innerHTML = '';
                settings.lives--;
                settings.score--;
                scoreContainer.innerText = settings.score;
                clicked = false;
                rerenderLives(settings.lives);
                elements[el] = getRandomNumber(gridNumber);
                renderElement(elements[el]);
            }
        } else {
            clicked = false;
        }
    }, settings.interval);

    const rerenderLives = (lives) => {
        livesContainer.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            const liveElement = document.createElement('div');
            liveElement.classList.add('live');
            livesFragment.appendChild(liveElement);
        }
        livesContainer.append(livesFragment);
    }
    let lastAddedScore = 0;
    const addOneMore = () => {
        if (settings.score === 2 && lastAddedScore === 0) {
            lastAddedScore = settings.score;
            elements.push(getRandomNumber(gridNumber));
            // for (let e = 0; e < elements.length; e++) {
            //     renderElement(elements[e]);
            // }
        }
        if (settings.score === (lastAddedScore * (lastAddedScore / 5)) && lastAddedScore > 0 && settings.rows >= elements.length) {
            lastAddedScore = settings.score;
            elements.push(getRandomNumber(gridNumber));
            for (let e = 0; e < elements.length; e++) {
                renderElement(elements[e]);
            }
        }
        console.log(settings.score, (lastAddedScore * (lastAddedScore / 5)))
    }

    addEventListener('click', event => {
        const target = event.target;
        console.log([target]);
        if (target.classList.contains('zenek')) {
            settings.score++;
            scoreContainer.innerText = settings.score;
            clicked = true;
            addOneMore();
            // rerenderLives(settings.lives);
            target.parentElement.innerHTML = '';
            for (let el = 0; el < elements.length; el++) {
                lastClickedZenon = elements[el];
                elements[el] = getRandomNumber(gridNumber);
                renderElement(elements[el]);
                // grids[elements[el]].innerHTML = '';
                // settings.score++;
                // scoreContainer.innerText = settings.score;
                // clicked = true;
                // rerenderLives(settings.lives);
                // elements[el] = getRandomNumber(gridNumber);
                // renderElement(elements[el]);
            }
            console.log(lastClickedZenon)
        } else {
            settings.lives--;
            settings.score--;
            scoreContainer.innerText = settings.score;
            clicked = true;
            rerenderLives(settings.lives);
        }
        
    }, true);
    elements.push(getRandomNumber(gridNumber));
    renderElement(elements[0]);
    rerenderLives(settings.lives);
}

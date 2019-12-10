

window.onload = () => {
    console.log('JS LOADED');
    const regexpArray = [
        /\w*(huj|pizda|kurwa|pojeb|jebaniec|popierdoleniec|popierdolony|chuj|chujek|penis|cipa|fiut|spierdolina|kurwik|kurwiszon|motherfucker|fucker|whore|hure|verfickte|matkojebca|pedal|pedał|zjeb|sukinsyn|suka|dziwka|kurewka|skurwiel|skurwysyn|fuggot|cock|pussy|fotze|schwanz|dupa|cwel|wyruchany|jebaka)\w*/i,
        /\w*(pornhub|xvideos|youporn|porn|adult|xxx)\w*/i
    ];
    const gameContainer = document.getElementById('game-container');
    const livesContainer = document.getElementById('lives-container');
    const scoreContainer = document.getElementById('score-container');
    const multiplyContainer = document.querySelector('.multiply');
    const newObjectBar = document.getElementById('new-object');
    const nextMultiplyBar = document.getElementById('next-multiply');
    const startGame = document.getElementById('start-game');
    const multiplyText = document.getElementById('multiply');
    const mainElement = document.getElementById('container');
    const whooshSound = document.getElementById('whoosh');
    const multiplySound = document.getElementById('multiply-sound');
    const soundOnOff = document.getElementById('sound');
    const gameStartCounter = document.getElementById('game-start-counter');
    const mainScreen = document.getElementById('main-screen');
    const btnSettings = document.getElementById('btn-settings');
    const settingsContainer = document.getElementById('settings');
    const hiscoreContainer = document.getElementById('hiscore-table');
    const btnHiscore =  document.getElementById('btn-hiscore');
    const gameContainerWidth = gameContainer.clientWidth;
    const gameContainerHeight = gameContainer.clientHeight;
    let gameIntervalFunction;
    const settings = {
        rows: 3,
        maxRows: 5,
        columns: 3,
        lives: 4,
        score: 0,
        interval: 1500,
        objects: 1,
        start: false,
        gameOver: false,
        multiply: 1,
        bonuses: {
            lastAddedObjectScore: 0,
            lastAddedRowScore: 0,
            lastAddedMultiplyScore: 0
        },
        sound: true,
        removeLiveOnAutoMove: true,
        moveOneObj: false,
    };
    let objects;
    let grids;
    let lastRandom = 0;
    let clicked = true;

    let gameInterval;

    const getRandomNumber = number => {
        let randomNumber = Math.floor(Math.random() * number);
        if (lastRandom !== randomNumber) {
            lastRandom = randomNumber;
        } else {
            getRandomNumber(number);
        }
    };
    const playWhooshSound = () => {
        if (settings.sound) {
            whooshSound.volume = 0.5;
            whooshSound.play();
        }
    }
    const playMultiplySound = () => {
        if (settings.sound) {
            multiplySound.volume = 0.5;
            multiplySound.play();
        }
    }

    let lastRandomColor = 0;
    const getColor = () => {
        const colors = [
            '#4db5ff','#f04141','#ed3257',
            '#42ed76','#f5ab33','#d75beb',
            '#9821ed','#fa7c41'
        ]
        const getRandomColor = () => {
            let random = Math.floor(Math.random() * colors.length);
            if (lastRandomColor !== random) {
                lastRandomColor = random;
            } else {
                getRandomColor();
            }
        }
        getRandomColor();
        return colors[lastRandomColor];
    }

    const renderGrid = (rows, cols, rerender) => {
        const gridNumber = rows * cols;
        const gridFragment = document.createDocumentFragment();

        for (let i = 0; i < gridNumber; i++) {
            const gridElement = document.createElement('div');
            gridElement.classList.add('grid');
            gridElement.style.height = ((gameContainerWidth / cols) - 20) + 'px';
            gridElement.style.width = ((gameContainerWidth / rows) - 20) + 'px';
            gridFragment.appendChild(gridElement);
        }
        gameContainer.append(gridFragment);
        grids = Array.from(document.querySelectorAll('.grid'));
        gameContainer.style.width = ((grids[0].offsetWidth * cols) + (cols * 11)) + 'px';

        if (rerender) {
            setTimeout(() => {
                for (let obj = 0; obj < objects.length; obj++) {
                    nextPosition(obj);
                }
            }, 400);
        }
    }

    const rerenderLives = (lives) => {
        const livesFragment = document.createDocumentFragment();
        livesContainer.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            const liveElement = document.createElement('img');
            liveElement.setAttribute('src', './assets/images/live.png');
            liveElement.classList.add('live');
            livesFragment.appendChild(liveElement);
        }
        livesContainer.append(livesFragment);
    }

    const rerenderGrid = (rows, columns) => {
        grids.forEach((g) => {
            g.remove();
        });
        renderGrid(rows, columns, true);
    }

    const addObjectToGame = (ob) => {
        getRandomNumber(settings.rows * settings.columns);
        const randomPlace = grids[lastRandom];
        const placePositionLeft = randomPlace.offsetLeft;
        const placePositionTop = randomPlace.offsetTop;
        gameContainer.append(ob.htmlObj);
        objects = Array.from(document.querySelectorAll('.object'));
        objects[ob.index].style.left = (placePositionLeft) + 'px';
        objects[ob.index].style.top = (placePositionTop) + 'px';
    }

    const nextPosition = (index) => {
        getRandomNumber(settings.rows * settings.columns);
        let randomPlace = grids[lastRandom];
        let placePositionLeft = randomPlace.offsetLeft;
        let placePositionTop = randomPlace.offsetTop;

        objects.forEach((object) => {
            if (object.offsetLeft === placePositionLeft && object.offsetTop === placePositionTop) {
                getRandomNumber(settings.rows * settings.columns);
                randomPlace = grids[lastRandom];
                placePositionLeft = randomPlace.offsetLeft
                placePositionTop = randomPlace.offsetTop;
            }
        });

        objects[index].style.width = (randomPlace.offsetWidth + 2) + 'px';
        objects[index].style.height = (randomPlace.offsetHeight + 2) + 'px';
        objects[index].style.left = placePositionLeft + 'px';
        objects[index].style.top = placePositionTop + 'px';
        clicked = true;
    }

    const applyPoints = () => {
        settings.score = settings.score + settings.multiply;
        scoreContainer.innerHTML = settings.score;
    }

    const removePoints = () => {
        settings.score--;
        settings.multiply = 1;
        multiplyText.innerText = settings.multiply
        scoreContainer.innerHTML = settings.score;
    }

    const removeLives = () => {
        settings.lives--;
        rerenderLives(settings.lives);
        if (settings.lives === 0) {
            settings.gameOver = true;
        }
    }
    const addRows = () => {
        settings.rows++;
        settings.columns++;
        rerenderGrid(settings.rows, settings.columns);
    }
    const addLives = () => {
        if (settings.lives < 3) {
            settings.lives++;
            rerenderLives(settings.lives);
        }
    }

    const countScoreToMultiply = () => {
        if (settings.score <= 20) {
            nextMultiplyBar.style.width = (settings.score * 5) + '%';
            newObjectBar.style.width = (settings.score * 5) + '%';
        }
        if (settings.score === 20) {
            settings.bonuses.lastAddedObjectScore = settings.score;
            settings.bonuses.lastAddedMultiplyScore = settings.score;
            settings.bonuses.lastAddedRowScore = settings.score;
            addObjectToGame(new object(objects.length));
            settings.multiply++;
            multiplyText.innerText = settings.multiply;
            addLives();
            playMultiplySound();
            mainElement.classList.add('rotated');
            gameContainer.style.transform = 'translateY(-50%) rotate(-90deg)';
            clicked = true;
        }

        // NEW OBJECT
        if (settings.score <= Math.floor(settings.bonuses.lastAddedObjectScore + (settings.bonuses.lastAddedObjectScore * 2))) {
            newObjectBar.style.width = Math.floor((settings.score * 100) / (settings.bonuses.lastAddedObjectScore + (settings.bonuses.lastAddedObjectScore * 2))) + '%';
        }
        if (settings.score >= Math.floor(settings.bonuses.lastAddedObjectScore + (settings.bonuses.lastAddedObjectScore * 2)) && settings.rows < (settings.rows * 3 - settings.rows) && settings.bonuses.lastAddedObjectScore > 0) {
            settings.bonuses.lastAddedObjectScore = settings.score;
            addObjectToGame(new object(objects.length));
            newObjectBar.style.width = '';
            mainElement.classList.toggle('rotated');
            if (mainElement.classList.contains('rotated')) {
                gameContainer.style.transform = 'translateY(-50%) rotate(-90deg)';
            } else {
                gameContainer.style.transform = 'translateY(-50%) rotate(90deg)';
            }
            clicked = true;
        }
        // NEW MULTIPLY and ADD LIVE
        if (settings.score <= Math.floor(settings.bonuses.lastAddedMultiplyScore + (settings.bonuses.lastAddedMultiplyScore / 2))) {
            nextMultiplyBar.style.width = Math.floor((settings.score * 100) / (settings.bonuses.lastAddedMultiplyScore + (settings.bonuses.lastAddedMultiplyScore / 2))) + '%';
        }
        if (settings.score >= Math.floor(settings.bonuses.lastAddedMultiplyScore + (settings.bonuses.lastAddedMultiplyScore / 2)) && settings.bonuses.lastAddedMultiplyScore > 0) {
            settings.bonuses.lastAddedMultiplyScore = settings.score;
            settings.multiply++;
            multiplyText.innerText = settings.multiply;
            addLives();
            playMultiplySound();
            nextMultiplyBar.style.width = '';
            mainElement.classList.toggle('rotated');
            if (mainElement.classList.contains('rotated')) {
                gameContainer.style.transform = 'translateY(-50%) rotate(-90deg)';
            } else {
                gameContainer.style.transform = 'translateY(-50%) rotate(90deg)';
            }
            clicked = true;
        }
        // NEW ROW
        if (settings.score >= Math.floor(settings.bonuses.lastAddedRowScore + (settings.bonuses.lastAddedRowScore * 2)) && settings.rows <= settings.maxRows && settings.bonuses.lastAddedRowScore > 0) {
            settings.bonuses.lastAddedRowScore = settings.score;
            addRows();
            settings.interval = settings.interval - 200;
            clicked = true;
        }
    }

    function object(index) {
        this.index = index;
        this.htmlObj = document.createDocumentFragment();

        const element = document.createElement('div');
        element.classList.add('object');
        element.dataset.objectIndex = index;
        element.style.width = (grids[0].offsetWidth) + 'px';
        element.style.height = (grids[0].offsetHeight) + 'px';
        element.style.background = getColor();

        this.htmlObj.appendChild(element);
    }

    addEventListener('click', event => {
        const target = event.target;
        const targetIndex = target.dataset.objectIndex;

        if (settings.start && !settings.gameOver) {
            if (target.classList.contains('object')) {
                countScoreToMultiply();
                applyPoints();
                playWhooshSound();
                if (settings.moveOneObj) {
                    nextPosition(target.dataset.objectIndex);
                } else {
                    for (let obj = 0; obj < objects.length; obj ++) {
                        nextPosition(objects[obj].dataset.objectIndex);
                    }
                }
                clicked = true;
            } else {
                removePoints();
                removeLives();
                playWhooshSound();
                for (let obj = 0; obj < objects.length; obj ++) {
                    nextPosition(objects[obj].dataset.objectIndex);
                }
                clicked = true;
            }
        }
        // GAME STARTER
        let startOnThree = 3;
        if (target.isEqualNode(startGame)) {
            event.preventDefault();
            function runGame() {
                gameContainer.classList.remove('hidden');
                gameContainer.classList.add('blur');
                livesContainer.classList.remove('hide');
                mainScreen.classList.add('hide');
                btnSettings.classList.add('hide');
                gameStartCounter.classList.remove('hide');
                settingsContainer.classList.remove('open');
                document.querySelector('.score-container').classList.remove('hide');
                document.getElementById('btn-yt').classList.add('hide');
                btnHiscore.classList.add('hide');
                startGame.style.bottom = '-100px';

                setTimeout(() => {
                    startOnThree--;
                    if (startOnThree === 0) {
                        settings.start = true;
                        soundOnOff.classList.add('hide');
                        gameContainer.classList.remove('blur');
                        gameStartCounter.classList.add('hide');
                        multiplyContainer.style.bottom = '90px';
                        gameIntervalFunction = () => {
                            if (!clicked) {
                                removePoints();
                                if (settings.removeLiveOnAutoMove) {
                                    removeLives();
                                }
                                playWhooshSound();
                                for (let obj = 0; obj < objects.length; obj ++) {
                                    nextPosition(objects[obj].dataset.objectIndex);
                                }
                            } else {
                                clicked = false;
                            }
                            if (!settings.gameOver) {
                                setTimeout(gameIntervalFunction, settings.interval);
                            } else {
                                const finish = document.getElementById('finish');
                                const fragment = document.createDocumentFragment();
                                const finishElement = document.createElement('div');
                                finishElement.classList.add('finish-container');
                                finishElement.innerHTML = `
                                    <h1>Congratulations</h1>
                                    <h2>Your score</h2>
                                    <h3 id="final-score">${settings.score}</h3>
                                    <p>please write your name</p>
                                    <input id="name" name="name" type="text" placeholder="your name" required>
                                    <button id="save-button">Save your score</button>
                                `;
                                fragment.appendChild(finishElement);
                                finish.append(fragment);
                                finish.classList.remove('hide');

                                gameContainer.classList.add('hidden');
                                gameContainer.classList.remove('blur');
                                livesContainer.classList.add('hide');
                                gameStartCounter.classList.add('hide');
                                newObjectBar.classList.add('hide');
                                nextMultiplyBar.classList.add('hide');
                                settingsContainer.classList.remove('open');
                                document.querySelector('.score-container').classList.add('hide');
                                multiplyContainer.style.bottom = '';

                                document.getElementById('save-button').addEventListener('click', event => {
                                    const name = document.getElementById('name');
                                    if (name.value.length >= 3 && name.value.length <= 10) {
                                        name.classList.remove('has-error');
                                        regexpArray.forEach(reg => {
                                            if (!reg.test(name.value)) {
                                                name.classList.remove('has-error-bad-word');
                                            } else {
                                                name.classList.add('has-error-bad-word');
                                                alert('That was not nice... And you know it. Please write correct name.');
                                            }
                                        });
                                    } else {
                                        name.classList.add('has-error');
                                        alert('Please write correct name between 3 and 10 letters.');
                                    }
                                }, true);
                            }
                        }
                        gameIntervalFunction();
                    }
                    if (!settings.gameOver && !settings.start) {
                        gameStartCounter.innerText = startOnThree;
                        runGame();
                    }
                }, 1000);
            }
            runGame();
        }
        if (target.innerHTML === 'on' || target.innerHTML === 'off') {
            target.parentElement.childNodes.forEach(child => {
                if (child.tagName === 'BUTTON') {
                    child.classList.toggle('active');
                }
            });
            if (target.parentElement) {

            }
            switch (target.parentElement.id) {
                case 'sound':
                    settings.sound = target.dataset.value === 'true';
                    break;
                case 'live-on-move':
                    settings.removeLiveOnAutoMove = target.dataset.value === 'true';
                    break;
                case 'move-one':
                    settings.moveOneObj = target.dataset.value === 'true';
                    break;
                default: false;
            }
        }
    }, true);

    // soundOnOff.addEventListener('click', () => {
    //     settings.sound = !settings.sound;
    //     soundOnOff.childNodes.forEach((child) => {
    //         if (child.tagName === "IMG") {
    //             child.classList.toggle('hide');
    //         }
    //     });
    // });

    btnSettings.addEventListener('click', event => {
        settingsContainer.classList.toggle('open');
    });

    btnHiscore.addEventListener('click', event => {
        hiscoreContainer.classList.toggle('open');
    });

    renderGrid(settings.rows, settings.columns);
    for (let obj = 0; obj < settings.objects; obj++) {
        addObjectToGame(new object(obj));
    }
    rerenderLives(settings.lives);
}
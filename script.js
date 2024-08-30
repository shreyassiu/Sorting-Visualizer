const n = 20;
const arr = [];
let time = 20;
let TimeoutId = null;
init();
let audioCtx = null;
function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}
function init() {
    if (TimeoutId) {
        clearTimeout(TimeoutId);
        TimeoutId = null;
        active();
    }
    container.innerHTML = "";
    for (let i = 0; i < n; i++) {
        arr[i] = Math.random() * 10;
    }
    showBars();
}
function disable() {
    Array.from(document.getElementsByClassName('sortBtn')).forEach(element => {
        element.setAttribute("disabled", "true")
    });
}
function active() {
    Array.from(document.getElementsByClassName('sortBtn')).forEach(element => {
        element.removeAttribute("disabled");
    });
}
function play(j) {
    disable();
    const temp = [...arr];
    let moves = [];
    if (j == 1)
        moves = bubbleSort(temp);
    else if (j == 2)
        moves = selectionSort(temp);
    else if (j == 3)
        moves = insertionSort(temp);
    else if (j == 4)
        moves = quickSort(temp);
    animate(moves);
}
function animate(moves) {
    if (moves.length == 0) {
        active();
        showBars();
        TimeoutId = null;
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type == "swap")
        [arr[i], arr[j]] = [arr[j], arr[i]];

    playNote(200 + arr[i] * 100);
    playNote(200 + arr[j] * 100);

    showBars(move);
    TimeoutId = setTimeout(function () {
        animate(moves);
    }, time);
}
function bubbleSort(arr) {
    const moves = [];

    for (let t = 0; t < arr.length; t++) {
        let swapped = false;
        for (let i = 1; i < arr.length - t; i++) {
            moves.push({
                indices: [i - 1, i], type: "comp"
            });
            if (arr[i - 1] > arr[i]) {
                moves.push({
                    indices: [i - 1, i], type: "swap"
                });
                swapped = true;
                [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
            }
        }
        if(swapped == false)
            break;
    }
    return moves;
}
function selectionSort(arr) {
    const moves = [];
    for (let i = 0; i < arr.length; i++) {
        let lowest = i
        for (let j = i + 1; j < arr.length; j++) {
            moves.push({
                indices: [j, lowest], type: "comp"
            });
            if (arr[j] < arr[lowest]) {
                lowest = j
            }
        }
        if (lowest !== i) {
            // Swap
            moves.push({
                indices: [i, lowest], type: "swap"
            });
            [arr[i], arr[lowest]] = [arr[lowest], arr[i]]
        }
    }
    return moves;
}
function insertionSort(arr) {
    const moves = [];

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            moves.push({
                indices: [j, j + 1],
                type: "comp"
            });
            moves.push({
                indices: [j, j + 1],
                type: "swap"
            });
            arr[j + 1] = arr[j];
            j--;
        }

        moves.push({
            indices: [j + 1, i],
            type: "comp"
        });
        arr[j + 1] = key;
    }

    return moves;
}
function quickSort(arr) {
    const moves = [];

    function partition(left, right) {
        let pivot = arr[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            moves.push({
                indices: [j, j],
                type: "comp"
            });

            if (arr[j] <= pivot) {
                i++;
                moves.push({
                    indices: [i, j],
                    type: "swap"
                });
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        moves.push({
            indices: [i + 1, right],
            type: "swap"
        });
        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];

        return i + 1;
    }

    function sort(left, right) {
        if (right - left <= 0) return;

        let pivotIndex = partition(left, right);

        sort(left, pivotIndex - 1);
        sort(pivotIndex + 1, right);
    }

    sort(0, arr.length - 1);
    return moves;
}
function showBars(move) {
    container.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = arr[i] * 10 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }

}

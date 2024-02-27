window.onload = setup;

function setup() {
	const table = document.getElementById("dispTable");

	const h1 = [];
	
	const h2 = [];

	const cells = [];

	function genHeadCell(headArr, i) {
		const h = document.createElement("TH");
		headArr[i] = [];
		headArr[i][0] = document.createElement("SPAN");
		headArr[i][1] = document.createElement("SPAN");
		h.appendChild(headArr[i][0]);
		h.appendChild(headArr[i][1]);
		return h;
	}

	// Setup the table initial state
	const t0 = document.createElement("TR");
	const c00 = document.createElement("TH");
	t0.appendChild(c00);
	for (let i = 0; i < 4; i++) {
		t0.appendChild(genHeadCell(h1, i));
	}
	table.appendChild(t0);
	for (let i = 0; i < 4; i++) {
		const r = document.createElement("TR");
		r.appendChild(genHeadCell(h2, i));
		cells[i] = [];
		for (let j = 0; j < 4; j++) {
			cells[i][j] = document.createElement("TD");
			r.appendChild(cells[i][j]);
		}
		table.appendChild(r);
	}


	const gen1 = [null, null, null, null];

	const gen2 = [null, null, null, null];

	const in1 = document.getElementById("input1");
	const in2 = document.getElementById("input2");
	in1.onkeyup = genKeyUpFn(in1, gen1);
	in2.onkeyup = genKeyUpFn(in2, gen2);
	in1.value = "";
	in2.value = "";
	//in1.focus();

	const errMsg = document.getElementById("errMsg");

	const alleleDisp1 = document.getElementById("allele1");
	const alleleDisp2 = document.getElementById("allele2");

	const genTable = document.getElementById("genTable");
	const phnTable = document.getElementById("phnTable");

	updateTable();

	function genKeyUpFn(domEl, genArr) {
		return function (evt) {

			const val = domEl.value.substring(0, 4);
			for (let i = 0; i < val.length; i++) {
				genArr[i] = val.charAt(i);
			}
			for (let i = val.length; i < genArr.length; i++) {
				genArr[i] = null;
			}
			if (checkValid()) {
				updateTable();
				errMsg.style.display = "none";
				if (domEl === in1 && val.length === 4) {
					in2.focus();
					in2.select();
				}
			} else {
				errMsg.style.display = "block";
			}
		}

	}


	function checkValid() {
		function check1Val(arr) {
			const a = arr.filter(x => x !== null);
			if (a.length > 0) {
				const c = a[0].toUpperCase();
				return a.every(x => x.toUpperCase() === c);
			}
			return true;
		}

		const phen1 = [gen1[0], gen1[1], gen2[0], gen2[1]];
		const phen2 = [gen1[2], gen1[3], gen2[2], gen2[3]];
		console.log(phen1, phen2)
		return check1Val(phen1) && check1Val(phen2);
	}


	function updateTable() {
		// Step 1: Sort the table by proper capitalization
		function swapCap(arr, i0, i1) {
			if (arr[i1] === null || arr[i0] === null) {
				return;
			}
			if (arr[i1] === arr[i1].toUpperCase()) {
				arr[i1] = arr[i0];
				arr[i0] = arr[i1].toUpperCase();
			}
		}

		swapCap(gen1, 0, 1);
		swapCap(gen1, 2, 3);
		swapCap(gen2, 0, 1);
		swapCap(gen2, 2, 3);

		// INVARIANT: The dominant allele of each genotype comes before the recessive

		// Step 2: Compute the headers
		const head1 = [];
		const head2 = [];
		for (let i = 0; i < 4; i++) {
			head1[i] = [gen1[Math.floor(i / 2)], gen1[2 + i % 2]];
			head2[i] = [gen2[Math.floor(i / 2)], gen2[2 + i % 2]];
			h1[i].forEach((x, ii) => { x.textContent = head1[i][ii] });
			h2[i].forEach((x, ii) => { x.textContent = head2[i][ii] });
		}



		const genMap = new Map();
		const phnMap = new Map();

		// Step 3: Fill in the cells
		cells.forEach((xx, j) => {
			xx.forEach((x, i) => {
				const arr = [head1[i][0], head2[j][0], head1[i][1], head2[j][1]];
				swapCap(arr, 0, 1);
				swapCap(arr, 2, 3);
				const g = arr.filter(x => x !== null).reduce((acc, val) => acc + val, "");
				x.textContent = g;
				if (g.length === 4) {
					genMap.set(g, (genMap.get(g) || 0) + 1);
					const p = arr[0] + arr[2];
					phnMap.set(p, (phnMap.get(p) || 0) + 1);
				}
			});
		});

		// Step 4: Update the allele displays
		const all1 = gen1[0] || gen2[0];
		const all2 = gen1[2] || gen2[2];

		alleleDisp1.textContent = all1 === null ? "??" : (all1.toUpperCase() + all1.toLowerCase());
		alleleDisp2.textContent = all2 === null ? "??" : (all2.toUpperCase() + all2.toLowerCase());

		// Step 5: Update the genotype and phenotype ratio displays
		function delEl(el) {
			while (el.lastChild) {
				el.removeChild(el.lastChild);
			}
		}
		delEl(genTable);
		delEl(phnTable);
		appendRow("TH", "Genotype", "Ratio", genTable);
		appendRow("TH", "Phenotype", "Ratio", phnTable);

		if (gen1.some(x => x === null) || gen2.some(x => x === null)) {
			return;
		}

		// Any code below here only executes if all parent genotypes have been completely entered

		genMap.forEach((val, key) => {
			appendRow("TD", key, val, genTable);
		});
		phnMap.forEach((val, key) => {
			appendRow("TD", key, val, phnTable);
		});

		function appendRow(cellType, cell1, cell2, table) {
			const r = document.createElement("TR");
			const c1 = document.createElement(cellType);
			c1.textContent = cell1;
			const c2 = document.createElement(cellType);
			if (cell2 != "Ratio")
				c2.textContent = (cell2 / 16) * 100 + "% " cell2 + ":16";
			else
				c2.textContent = cell2;
			r.appendChild(c1);
			r.appendChild(c2);
			table.appendChild(r);
		}

		// Any code below here only executes if all parent genotypes have been completely entered
	}

	document.getElementById("clearBtn").onclick = function () {
		for (let i = 0; i < 4; i++) {
			gen1[i] = null;
			gen2[i] = null;
		}
		in1.value = "";
		in2.value = "";
		updateTable();
		//in1.focus();
	};

}

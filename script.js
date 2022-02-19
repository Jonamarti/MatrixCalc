
window.onload = function () {
	var myFu = ['sin', 'cos', 'tan', 'cosec', 'exp', 'sinh', 'cosh', 'tanh'];
	const mySy = ['+', '*', '^', '(', ')'];
	var variables = [];
	var varDependencies = [];
	var constants = [];

	class MyMatrix {
		constructor(rows, cols, ...entries) {
			if (entries.length === 0) {

				this.array = [];
				this.row = rows;
				this.col = cols;
				for (let i = 0; i < this.row; i++) {
					this.array[i] = [];
					for (let j = 0; j < this.col; j++) {
						if (i == j) {
							this.array[i][j] = 1;
						}
						else {
							this.array[i][j] = 0;
						}

					}
				}
			}
			else if (entries.length < rows * cols) {
				alert("There are not enough entries, rows: " + rows + ", cols: " + cols + ", entries.length: " + entries.length);
			} else if (entries.length > rows * cols) {
				alert("There are too many entries: " + rows + cols + entries.length);
			} else {
				//alert(rows + cols + entries.length)
				this.row = rows;
				this.col = cols;
				this.rank = "" + rows + "," + cols;
				this.array = [];
				for (let i = 0; i < this.row; i++) {
					this.array[i] = [];
					for (let j = 0; j < this.col; j++) {
						this.array[i][j] = entries[i * cols + j];
					}
				}
			}


			this.printValues = function () {
				for (let i = 0; i < this.row; i++) {
					var tempString = "(";
					for (let j = 0; j < this.col; j++) {
						tempString += this.array[i][j];
						if (j < (this.col - 1)) {
							tempString += ',';
						}
						else {
							tempString += ')';
							alert(tempString);
						}
					}
				}
			};

			this.addMatrixes = function (ob1) {
				if (this.row == ob1.row && this.col == ob1.col) {
					var res = new MyMatrix(this.row, this.col);
					var table3 = document.getElementById("t3");

					while (table3.rows.length < res.row) {
						AR3M();
					}
					while (table3.rows.length > res.row) {
						DR3M();
					}
					while (table3.rows[0].cells.length < res.col) {
						AC3M();
					}
					while (table3.rows[0].cells.length > res.col) {
						DC3M();
					}

					for (let i = 0; i < this.row; i++) {
						for (let j = 0; j < this.col; j++) {
							let t = this.array[i][j];
							let o = ob1.array[i][j];
							let r = res.array[i][j];
							let c1 = isNum(t);
							let c2 = Number(t) === 0;
							let c3 = isNum(o);
							let c4 = Number(o) === 0;
							var checker = c1 + "," + c2 + "," + c3 + "," + c4;
							switch (c1 + "," + c2 + "," + c3 + "," + c4) {
								// t==0 && o==0
								case (true + "," + true + "," + true + "," + true):
									res.array[i][j] = 0;
									break;
								//t==0 && o!=0
								case (true + "," + true + "," + true + "," + false):
									res.array[i][j] = o;
									break;
								//t==0 && o not number
								case (true + "," + true + "," + false + "," + false):
									res.array[i][j] = o;
									break;
								//t!=0 && o==0:
								case (true + "," + false + "," + true + "," + true):
									res.array[i][j] = t;
									break;
								//t!=0 && o!=0
								case (true + "," + false + "," + true + "," + false):
									res.array[i][j] = Number(t) + Number(o);
									break;
								//t!=0 && o not number
								case (true + "," + false + "," + false + "," + false):
									res.array[i][j] = o + "+" + t;
									break;
								//t not number && o==0
								case (false + "," + false + "," + true + "," + true):
									res.array[i][j] = t;
									break;
								//t not number && o!=0
								case (false + "," + false + "," + true + "," + false):
									res.array[i][j] = t + "+" + o;
									break;
								//t not number && o not number
								case (false + "," + false + "," + false + "," + false):
									res.array[i][j] = t + "+" + o;
									break;
								default:
								// Later ill have to handle exceptions
							}
						}
					}
					return res;
				}
				else {
					alert("The ranks dont match up! Rows and columns of first matrix: (" +
						this.row + "," + this.col + "). Rows and cols of second matrix: (" + ob1.row +
						"," + ob1.col + ")");
				}
			};


			this.traspose = function () {
				let a = new MyMatrix(this.col, this.row);
				for (let i = 0; i < this.row; i++) {
					for (let j = 0; j < this.col; j++) {
						a.array[j][i] = this.array[i][j];
					}
				} return a;
			};

			//Only 90, 180, 270 degrees rotation
			this.rotate = function (degrees) {
				if (degrees == 90) {
					let res = new MyMatrix(this.row, this.col);
					for (let i = 0; i < this.row / 2; i++) {
						// Consider elements in group of 4 in  
						// current square 
						for (let j = i; j < this.col - i - 1; j++) {
							// save cell in temporary variable
							let temp = this.array[i][j];

							// copy from right of row to top of col 
							this.array[i][j] = this.array[j][this.row - 1 - i];

							// copy from bottom of col to right of row 
							this.array[j][this.row - 1 - i] = this.array[this.row - 1 - i][this.row - 1 - j];

							// copy from left to bottom 
							this.array[this.row - 1 - i][this.row - 1 - j] = this.array[this.row - 1 - j][i];

							// get saved in temp
							this.array[this.row - 1 - j][i] = temp;
						}
					} return this;
				}
				/*
				else if((degrees%90)==0){
					this.rotate(90);
					this.rotate(90);
					return this;
				}
				//to be implemented?
				*/
			};

			this.multiplicateMatrixes = function (obj) {
				if (this.col == obj.row) {
					var res = new MyMatrix(this.row, obj.col);
					for (let thisrow = 0; thisrow < this.row; thisrow++) {
						for (let objcol = 0; objcol < obj.col; objcol++) {
							var acumulador = 0;
							var varDict = {};
							for (let objrow = 0; objrow < obj.row; objrow++) {
								let t = this.array[thisrow][objrow];
								let o = obj.array[objrow][objcol];
								if (isNum(t) && isNum(o) && (t == 0 || o == 0)) {
									//Either zero, do nothin
								}
								else if (isNum(t) && isNum(o) && t != 0 && o != 0) {
									// Not zero, normal multiplication. Later work though dictionary

									acumulador += t * o;
								}
								else if ((isNum(t) && !isNum(o) && t == 0) || (!isNum(t) && isNum(o) && o == 0)) {
									// One of them is zero, do nothing

								}
								else if (!isNum(t) && !isNum(o)) {
									//Not numbers, just append. Later through dict
									if (acumulador == 0) {
										if (t in varDict) {
											varDict[t] += 1;
										}
										else if (!(t in varDict)) {
											varDict[t] = 1;
										}
										acumulador = t + "*" + o;
									}
									else {
										acumulador += "+" + t + "*" + o;
									}


								}
								else if (isNum(t) && !isNum(o) && t != 0) {
									// o variable, t num
									if (acumulador == 0) {
										acumulador = t + "*" + o;
									}
									else {
										acumulador += "+" + t + "*" + o;
									}
									if (o in varDict) {
										varDict[o] += 1;
									}
									else if (!(o in varDict)) {
										varDict[o] = 1;
									}
								}
								else if (!isNum(t) && isNum(o) && o != 0) {
									// t variable, o num
									if (acumulador == 0) {
										acumulador = o + "*" + t;
									}
									else {
										acumulador += "+" + o + "*" + t;
									}
									if (t in varDict) {
										varDict[t] += 1;
									}
									else if (!(t in varDict)) {
										varDict[t] = 1;
									}
								}

								res.array[thisrow][objcol] = acumulador;
								/*
								for (let key in varDict){
									alert("key: " + key + "value: " + varDict[key]);
								}*/

							}
						}
					}
					return res;
				}
				else {
					alert("The ranks dont match up! Rows and columns of first matrix: (" +
						this.row + "," + this.col + "). Rows and cols of second matrix: (" + obj.row +
						"," + obj.col + ")")
				}
			};

			this.loadMatrix = function (tableId) {
				var tablaACopiar = document.getElementById(tableId);
				//var rows = tablaACopiar.rows.length;
				//var cols = tablaACopiar.rows[0].cells.length;
				var m = new MyMatrix(rows, cols);
				m.row = rows;
				m.col = cols;
				for (var i = 0, row; row = tablaACopiar.rows[i]; i++) {
					for (var j = 0, col; col = row.cells[j]; j++) {
						//alert('col html>>'+col.innerHTML);  //Will give the html content of cell
						//alert('col>>'+col.innerText); //Gives text content of cell
						m.array[i][j] = col.getElementsByTagName("input")[0].value;
					}
				}
				return m;
			};

			this.displayMatrix = function (tableId) {
				var table = document.getElementById(tableId);

				rows = table.rows.length;
				cols = table.rows[0].cells.length;
				for (var i = 0, row; row = table.rows[i]; i++) {
					for (var j = 0, col; col = row.cells[j]; j++) {
						col.getElementsByTagName("input")[0].value = this.array[i][j];
					}
				}

			};

			this.cofactor = function (rowIndex, colIndex) {
				if (this.row === 1) {
					return this.array[0][0];
				}
				else if (this.row > 1) {
					for (let contminores = 0; contminores < this.row; contminores++) {
						var cofmat = new MyMatrix(this.row - 1, this.col - 1);
						for (let i = 0; i < this.row; i++) {
							for (let j = 0; j < this.col; j++) {
								if (i != rowIndex && j != colIndex) {
									if (i < rowIndex && j < colIndex) {
										cofmat.array[i][j] = this.array[i][j];
									}
									else if (i < rowIndex && j > colIndex) {
										cofmat.array[i][j - 1] = this.array[i][j];
									}
									else if (i > rowIndex && j < colIndex) {
										cofmat.array[i - 1][j] = this.array[i][j];
									}
									else if (i > rowIndex && j > colIndex) {
										cofmat.array[i - 1][j - 1] = this.array[i][j];
									}
								}
							}
						} return cofmat;
					}
				}
			};

			this.determinant = function () {
				//First check if its a square matrix
				if (this.row === this.col) {
					var determinant = 0;
					let order = this.row;
					if (order === 1) {
						determinant += this.array[0][0];
						return determinant;
					}
					else if (order === 2) {
						determinant += this.array[0][0] * this.array[1][1] - this.array[0][1] * this.array[1][0];
						return determinant;
					}
					else if (order > 2) {
						var cofac = 0;
						for (let ro = 0; ro < this.ro; ro++) {
							var newCoMat = this.cofactor();
							minorCreo += 0; //////////////////////////////
						}
					} return determinant;
				}
				else {
					alert("Only square matrixes have determinant");
				}
			};
		}
	}

	var additionButton = document.getElementById("Addition button");
	additionButton.addEventListener("click", Add);
	function Add() {
		var tabla1 = document.getElementById("t1");
		var tabla2 = document.getElementById("t2");
		var tabla3 = document.getElementById("t3");

		var m1 = new MyMatrix(tabla1.rows.length, tabla1.rows[0].cells.length);
		m1 = m1.loadMatrix("t1");


		var m2 = new MyMatrix(tabla2.rows.length, tabla2.rows[0].cells.length);
		m2 = m2.loadMatrix("t2");

		var m3 = new MyMatrix(tabla2.rows.length, tabla2.rows[0].cells.length);
		m3 = m1.addMatrixes(m2);
		m3.displayMatrix("t3");
	}

	var multiplyButton = document.getElementById("Multiplication button");
	multiplyButton.addEventListener("click", Multiply);
	function Multiply() {
		var tabla1 = document.getElementById("t1");
		var tabla2 = document.getElementById("t2");
		var tabla3 = document.getElementById("t3");

		var m1 = new MyMatrix(tabla1.rows.length, tabla1.rows[0].cells.length);
		m1 = m1.loadMatrix("t1");


		var m2 = new MyMatrix(tabla2.rows.length, tabla2.rows[0].cells.length);
		m2 = m2.loadMatrix("t2");

		var m3 = new MyMatrix(tabla2.rows.length, tabla2.rows[0].cells.length);
		m3 = m1.multiplicateMatrixes(m2);
		m3.displayMatrix("t3");
	}

	var clear1Button = document.getElementById("Clear first matrix");
	clear1Button.addEventListener("click", Clear1M);
	function Clear1M() {
		var table = document.getElementById("t1");
		for (var i = 0; row = table.rows[i]; i++) {
			for (var j = 0; col = row.cells[j]; j++) {
				col.getElementsByTagName("input")[0].value = 0;
			}
		}
	}

	var clear2Button = document.getElementById("Clear second matrix");
	clear2Button.addEventListener("click", Clear2M);
	function Clear2M() {
		var table = document.getElementById("t2");
		for (var i = 0; row = table.rows[i]; i++) {
			for (var j = 0; col = row.cells[j]; j++) {
				col.getElementsByTagName("input")[0].value = 0;
			}
		}
	}

	var identity1Button = document.getElementById("Identity first matrix");
	identity1Button.addEventListener("click", Ident1M);
	function Ident1M() {
		var table = document.getElementById("t1");
		for (var i = 0; row = table.rows[i]; i++) {
			for (var j = 0; col = row.cells[j]; j++) {
				if (i == j) {
					col.getElementsByTagName("input")[0].value = 1;
				} else {
					col.getElementsByTagName("input")[0].value = 0;
				}

			}
		}
	}

	var identity2Button = document.getElementById("Identity second matrix");
	identity2Button.addEventListener("click", Ident2M);
	function Ident2M() {
		var table = document.getElementById("t2");
		for (var i = 0; row = table.rows[i]; i++) {
			for (var j = 0; col = row.cells[j]; j++) {
				//alert(table.rows[i].cells[j].getElementById("in"));
				if (i == j) {
					col.getElementsByTagName("input")[0].value = 1;


				} else {
					col.getElementsByTagName("input")[0].value = 0;
				}

			}
		}
	}

	var BtoAButton = document.getElementById("B to A");
	BtoAButton.addEventListener("click", BtoA);
	function BtoA() {
		var table1 = document.getElementById("t1");
		var table2 = document.getElementById("t2");
		if (table1.rows[0].length == table2.rows[0].length && table1.rows[0].cells.length == table2.rows[0].cells.length) {
			for (var i = 0, row2; row2 = table2.rows[i]; i++) {
				for (var j = 0, col2; col2 = row2.cells[j]; j++) {
					table1.rows[i].cells[j].getElementsByTagName("input")[0].value = col2.getElementsByTagName("input")[0].value;
				}
			}
		}
		else {
			alert("The ranks dont match");
		}
	}

	var AtoBButton = document.getElementById("A to B");
	AtoBButton.addEventListener("click", AtoB);
	function AtoB() {
		var table1 = document.getElementById("t1");
		var table2 = document.getElementById("t2");
		for (var i = 0, row1; row1 = table1.rows[i]; i++) {
			for (var j = 0, col1; col1 = row1.cells[j]; j++) {
				table2.rows[i].cells[j].getElementsByTagName("input")[0].value = col1.getElementsByTagName("input")[0].value;
			}
		}
	}

	var CtoAButton = document.getElementById("C to A");
	CtoAButton.addEventListener("click", CtoA);
	function CtoA() {
		var table1 = document.getElementById("t1");
		var table3 = document.getElementById("t3");
		for (var i = 0, row3; row3 = table3.rows[i]; i++) {
			for (var j = 0, col3; col3 = row3.cells[j]; j++) {
				table1.rows[i].cells[j].getElementsByTagName("input")[0].value = col3.getElementsByTagName("input")[0].value;
			}
		}
	}

	var CtoBButton = document.getElementById("C to B");
	CtoBButton.addEventListener("click", CtoB);
	function CtoB() {
		var table2 = document.getElementById("t2");
		var table3 = document.getElementById("t3");
		for (var i = 0, row3; row3 = table3.rows[i]; i++) {
			for (var j = 0, col3; col3 = row3.cells[j]; j++) {
				table2.rows[i].cells[j].getElementsByTagName("input")[0].value = col3.getElementsByTagName("input")[0].value;
				
			}
		}
	}

	var SecondDeterminantButton = document.getElementById("Second matrix determinant");
	SecondDeterminantButton.addEventListener("click", SecondDeterminant);
	function SecondDeterminant() {
		var table2 = document.getElementById("t2");
		for (var i = 0, row2; row2 = table2.rows[i]; i++) {
			for (var j = 0, col2; col2 = row2.cells[j]; j++) {
				checkAdd(col2.innerText);
				table2.rows[i].cells[j].innerText = col2.innerText;
			}
		}
	}

	var AddRow1MButton = document.getElementById("Add row to A");
	AddRow1MButton.addEventListener("click", AR1M);
	function AR1M() {
		var table = document.getElementById("t1");
		var row = table.insertRow(-1);
		for (let i = 0; i < table.rows[0].cells.length; i++) {
			let newCell = row.insertCell(i);
			let inp = document.createElement("input");
			inp.type = "text";
			inp.value = 1;
			inp.style = "width: 50%";
			//------------------ Not recognizing following onkeypress------------
			inp.onkeypress = "this.style.width = ((this.value.length + 1) * 8) + 'px' )";
			newCell.appendChild(inp);
		}
	}

	var AddRow2MButton = document.getElementById("Add row to B");
	AddRow2MButton.addEventListener("click", AR2M);
	function AR2M() {
		var table2 = document.getElementById("t2");
		var row = table2.insertRow(-1);
		for (let i = 0; i < table2.rows[0].cells.length; i++) {
			let newCell = row.insertCell(i);
			let inp = document.createElement("input");
			inp.type = "text";
			inp.value = 1;
			inp.style = "width: 50%";
			//------------------ Not recognizing following onkeypress------------
			inp.onkeypress = "this.style.width = ((this.value.length + 1) * 8) + 'px' )";
			newCell.appendChild(inp);
		}
	}

	var DeleteRow1MButton = document.getElementById("Delete row from A");
	DeleteRow1MButton.addEventListener("click", DR1M);
	function DR1M() {
		var table1 = document.getElementById("t1");
		if (table1.rows.length > 1) {
			document.getElementById("t1").deleteRow(-1);
		}
	}

	var DeleteRow2MButton = document.getElementById("Delete row from B");
	DeleteRow2MButton.addEventListener("click", DR2M);
	function DR2M() {
		var table2 = document.getElementById("t2");
		if (table2.rows.length > 1) {
			document.getElementById("t2").deleteRow(-1);
		}
	}

	var AddCol1MButton = document.getElementById("Add col to A");
	AddCol1MButton.addEventListener("click", AC1M);
	function AC1M() {
		var table1 = document.getElementById("t1");
		for (let i = 0; i < table1.rows.length; i++) {
			let newCell = table1.rows[i].insertCell(-1);
			let inp = document.createElement("input");
			inp.value = 1;
			inp.type = "text";
			inp.style = "width: 50%";
			//------------------ Not recognizing following onkeypress------------
			inp.onkeypress = "this.style.width = ((this.value.length + 1) * 8) + 'px' )";

			newCell.appendChild(inp);
		}
	}


	var AddCol2MButton = document.getElementById("Add col to B");
	AddCol2MButton.addEventListener("click", AC2M);
	function AC2M() {
		var table2 = document.getElementById("t2");
		for (let i = 0; i < table2.rows.length; i++) {
			let newCell = table2.rows[i].insertCell(-1);
			let inp = document.createElement("input");
			inp.value = 1;
			inp.type = "text";
			inp.style = "width: 50%";
			//------------------ Not recognizing following onkeypress------------
			inp.onkeypress = "this.style.width = ((this.value.length + 1) * 8) + 'px' )";

			newCell.appendChild(inp);
		}
	}

	var TrasposeA = document.getElementById("Traspose A");
	TrasposeA.addEventListener("click", TA);
	function TA() {
		var tabla1 = document.getElementById("t1");
		var m1 = new MyMatrix(tabla1.rows.length, tabla1.rows[0].cells.length);
		m1 = m1.loadMatrix("t1");
		m2 = m1.traspose();
		m2.displayMatrix("t1");
	}

	var TrasposeB = document.getElementById("Traspose B");
	TrasposeB.addEventListener("click", TB);
	function TB() {
		var tabla2 = document.getElementById("t2");
		var m2 = new MyMatrix(tabla2.rows.length, tabla2.rows[0].cells.length);
		m2 = m2.loadMatrix("t2");
		m2 = m2.traspose();
		m2.displayMatrix("t2");
	}

	var RotateA = document.getElementById("Rotate A");
	RotateA.addEventListener("click", RA);
	function RA() {
		var tabla1 = document.getElementById("t1");
		var m1 = new MyMatrix(tabla1.rows.length, tabla1.rows[0].cells.length);
		m1 = m1.loadMatrix("t1");
		m1 = m1.rotate(90);
		m1.displayMatrix("t1");
	}

	function AC3M() {
		var table3 = document.getElementById("t3");
		for (let i = 0; i < table3.rows.length; i++) {
			let newCell = table3.rows[i].insertCell(-1);
			let inp = document.createElement("input");
			inp.value = 1;
			inp.type = "text";
			inp.style = "width: 50%";
			//------------------ Not recognizing following onkeypress------------
			inp.onkeypress = "this.style.width = ((this.value.length + 1) * 8) + 'px' )";

			newCell.appendChild(inp);
		}
	}

	function AR3M() {
		var table3 = document.getElementById("t3");
		var row = table3.insertRow(-1);
		for (let i = 0; i < table3.rows[0].cells.length; i++) {
			let newCell = row.insertCell(i);
			let inp = document.createElement("input");
			inp.type = "text";
			inp.value = 1;
			inp.style = "width: 50%";
			//------------------ Not recognizing following onkeypress------------
			inp.onkeypress = "this.style.width = ((this.value.length + 1) * 8) + 'px' )";
			newCell.appendChild(inp);
		}
	}

	function DR3M() {
		var table3 = document.getElementById("t3");
		if (table3.rows.length > 1) {
			document.getElementById("t3").deleteRow(-1);
		}
	}



	function parseTxt(text) { //Quit all spaces
		var textWithNoSpaces = [];
		acumulador = '';
		var symbolsD = {};
		var variablesD = {};
		for (let i = 0; i < text.length; i++) {
			if (text[i] == " ") { //if a whitespace is found:

				if (!(acumulador in symbolsD) && acumulador.length != 0) { //if word not in dictionary
					textWithNoSpaces[textWithNoSpaces.length] = acumulador;
					symbolsD[acumulador] = 1;
					acumulador = '';
				}

				else if ((acumulador in symbolsD) && acumulador.length != 0) {

					textWithNoSpaces[textWithNoSpaces.length] = acumulador;
					symbolsD[acumulador] += 1;
					acumulador = '';
				}
			}
			else {
				acumulador += text[i];
				if (i == text.length - 1) {
					//textWithNoSpaces[textWithNoSpaces.length].push(acumulador);
					textWithNoSpaces[textWithNoSpaces.length] = acumulador;
					if (!(acumulador in symbolsD)) {
						symbolsD[acumulador] = 1;
						acumulador = '';
					}
					else {
						symbolsD[acumulador] += 1;
						acumulador = '';
					}
				}
			}
		}
		/* alert("textWithNoSpaces: " + textWithNoSpaces);
		for (var key in symbolsD){
			alert("value: "+symbolsD[key] + " key: " +key)
		}
		*/

		// Till now spaces have been quitted, symbols are in a dictionary, textWithNoSpaces is self-explaining. Now we iterate through the variables searching for their coefficients.
		//First i iterate through symbolsD to find variables appearing



		for (var key in symbolsD) {
			var value = symbolsD[key];
			for (var fu in myFu) {
				if (key.includes(fu)) { // if its not a function
					break;
				}
				if (key in variablesD) { //if its not already in vD
					alert("key: " + key + " appears: " + variablesD[key]);
					variablesD[key] += 1;
					break;
				}
				else {
					variablesD[key] = 1;
					break;
				}
			}



		}
		/*
		for (var key in variablesD){
			alert("key: " +key); alert("value: " + variablesD[key]);
		}*/

	}

	function isNum(num) {
		return !isNaN(parseFloat(num)) && isFinite(num);
	}

	var m = new MyMatrix(3, 3);
	m.displayMatrix("t3");

	//parseTxt("         4x      +     5y     +    tan(k)");

};

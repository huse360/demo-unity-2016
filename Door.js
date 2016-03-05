///////////////////////////////////////////////////////////////
// Sunday, January 31, 2016 at 4:32:47 PM
// Copyright (c) 2016 Hussein Nazarala. All rights reserved.
///////////////////////////////////////////////////////////////

//#CUSTOMCODE

///////////////////////////////////////////////////////////////
//		CUSTOM IMPLEMENTATION
///////////////////////////////////////////////////////////////
#pragma strict

///////////////////////////////////////////////////////////////
//		logic vars
///////////////////////////////////////////////////////////////

var currentState: int = 0;
var returnValue: int = 0;

///////////////////////////////////////////////////////////////
//		jump code
///////////////////////////////////////////////////////////////
var stateStack = new int[4];
var stackCounter = 0;

function jumpTo(state: int) {
		stateStack [stackCounter] = currentState;
		stackCounter++;
		currentState = state;
		if (stackCounter >= stateStack.length)
		{print ("STACK OVERFLOW!!! :(");}
}
///////////////////////////////////////////////////////////////
function jumpBack() {
		stackCounter--;
		currentState = stateStack [stackCounter] ;

}

///////////////////////////////////////////////////////////////
//		PERFORM CURRENT STATE
///////////////////////////////////////////////////////////////

function performCurrentState() {
   		
   var dataColumn: int = 0;  //puede ser 0 o 1
   var dataRow: int = 0; // es el doble del estado actual
   var nextState: int = 0;
   
   //Ejecutar el estado actual
   //Hallar la columna
  //dataColumn = stateFunctions[currentState]();
   
   stateFunctions[currentState]();
   dataColumn = returnValue;
    //Aquí se puede aprovechar para saltar de estado
   //...
   //Hallar la fila
   dataRow = currentState << 1;
   //Obtener el siguiente estado
   nextState = decisionData[dataRow + dataColumn];
   //Actualizar el estado
   currentState = nextState;
   //currentState  = decisionData[ (currentState << 1) + stateFunctions[currentState]()];   
}


private var near : int = 0;
private var front : int = 0;

private var button : int = 0;


private var anim : Animation;
private var keyInput: KeyInput;
private var gameMaster : GameMaster;

var isLocked : int = 0;
var haveIronBars : int = 0;
var unlockIronBars : int = 0;


private var didUnlockingFinish: int = 0;


function OnTriggerEnter (col : Collider) 
{
	if (col.gameObject.name == "Hero")
	{
		near = 1;
		var dir : Vector3 =  col.gameObject.transform.position - gameObject.transform.position;
		var dot : float = Vector3.Dot(dir, gameObject.transform.right);
		
		if (dot < 0)
		{
			front = 1;
			//print ("Estas al frente ");
		}
		else
		{
			front = 0;
			//print ("Estas detras ");
			
		}
		
	}
	
}


function OnTriggerExit (col : Collider) 
{
	if (col.gameObject.name == "Hero")
	{
		near = 0;
	}
	
}
function Start()
{
	//Obtener instancia de palanca
	keyInput = KeyInput.GetInstance();
	
}

function Update()
{
	if (keyInput.GetButton(InputButtonsIndex.BUTTON_CTRL) 
			== 0x01) // unless Jump is pressed!
	{

		button |= 0x01;
		
	}
	
	performCurrentState();
}

function PlayAudio (a : AudioClip)
{
	GetComponent.<AudioSource>().clip = a;
	GetComponent.<AudioSource>().Play();
	
}

function UnlockingFinished ()
{
	didUnlockingFinish = 1;
}

function callbackOnSwitch ()
{
	unlockIronBars = 1;
	
	haveIronBars = 0;
	anim.PlayQueued("IronOpen");
	
	
}

function IronOpenFinished ()
{
	GameObject.Find(gameObject.name + "/Iron").SetActive(false);
}

///////////////////////////////////////////////////////////////
//	END OF CUSTOM CODE.
///////////////////////////////////////////////////////////////
//#ENDOFCUSTOMCODE

		
		
///////////////////////////////////////////////////////////////
//		MACHINE LOGIC
///////////////////////////////////////////////////////////////
private var decisionData : int [] =[
1, 1, 2, 2, 2, 3, 4, 4, 5, 7, 6, 4, 1, 1, 11, 8, 9, 9, 10, 10, 1, 10, 12, 18, 13, 13, 14, 14, 15, 15, 16, 15, 17, 17, 1, 1, 19, 20, 9, 9, 21, 21, 21, 22, 12, 12, 24, 24, 25, 25, 25, 25 	 ];

///////////////////////////////////////////////////////////////
//		STATES DECLARATION
///////////////////////////////////////////////////////////////
private var stateFunctions : function()[] =[
start, Closed, IsHeroNear, ShowHintGUI, DidPressButton, IsHeroStillNear, HideHintGUI2, AreIronBars, DoorHasIronBars, HideHintGUI_2, IsHeroNear3, IsDoorLocked, Opening, Opened, HideHintGUI, IsHeroNear2, Closing, Foo, DoYouHaveKey, DoorIsLocked, Unlocking, DidUnlockingFinished, HideLock, Foo, Dummy, _return 	 ];

///////////////////////////////////////////////////////////////
//		STATES DEFINITION
///////////////////////////////////////////////////////////////
//##0
function start()  
{//#Begin

	anim = GetComponent.<Animation>(); 
	
	gameMaster = GameObject.Find("GameMaster").
				GetComponent.<GameMaster>();
	
	//If is unlocked  hide the lock			
	if (isLocked == 0)
	{
		//GameObject.Find(gameObject.name + "/Lock")
		//	.GetComponent.<Renderer>().enabled = false;
			GameObject.Find(gameObject.name + "/Lock").SetActive(false);
			
	}
	//I doesn't have iron bars hide them
	if (haveIronBars == 0)
	{
		GameObject.Find(gameObject.name + "/Iron").SetActive(false);
			
	}		

}//#End

///////////////////////////////////////////////////////////////
//##1
function Closed()  
{//#Begin

	anim.PlayQueued("Closed");

}//#End

///////////////////////////////////////////////////////////////
//##2
function IsHeroNear()  
{//#Begin

	button = 0;
returnValue = near;

}//#End

///////////////////////////////////////////////////////////////
//##3
function ShowHintGUI()  
{//#Begin

	gameMaster.ShowHint(true);
//
}//#End

///////////////////////////////////////////////////////////////
//##4
function DidPressButton()  
{//#Begin
	
	returnValue = button;

}//#End

///////////////////////////////////////////////////////////////
//##5
function IsHeroStillNear()  
{//#Begin

	IsHeroNear();

}//#End

///////////////////////////////////////////////////////////////
//##6
function HideHintGUI2()  
{//#Begin

	HideHintGUI();

}//#End

///////////////////////////////////////////////////////////////
//##7
function AreIronBars()  
{//#Begin

returnValue = haveIronBars;

}//#End

///////////////////////////////////////////////////////////////
//##8
function DoorHasIronBars()  
{//#Begin

	anim.PlayQueued("IronLocked");
	print("Iron bars. Figure out how to open it");

}//#End

///////////////////////////////////////////////////////////////
//##9
function HideHintGUI_2()  
{//#Begin

	HideHintGUI();

}//#End

///////////////////////////////////////////////////////////////
//##10
function IsHeroNear3()  
{//#Begin

	IsHeroNear();

}//#End

///////////////////////////////////////////////////////////////
//##11
function IsDoorLocked()  
{//#Begin

	returnValue = isLocked;

}//#End

///////////////////////////////////////////////////////////////
//##12
function Opening()  
{//#Begin

	if  (front == 1)
	{
		anim.PlayQueued("Opening2");		
	}
	else
	{
		anim.PlayQueued("Opening");		
		
	}

}//#End

///////////////////////////////////////////////////////////////
//##13
function Opened()  
{//#Begin

	if  (front == 1)
	{
		anim.PlayQueued("Opened2");		
	}
	else
	{
		anim.PlayQueued("Opened");		
		
	}

}//#End

///////////////////////////////////////////////////////////////
//##14
function HideHintGUI()  
{//#Begin

	gameMaster.ShowHint(false);

}//#End

///////////////////////////////////////////////////////////////
//##15
function IsHeroNear2()  
{//#Begin

	IsHeroNear();

}//#End

///////////////////////////////////////////////////////////////
//##16
function Closing()  
{//#Begin

	if  (front == 1)
	{
		anim.PlayQueued("Closing2");		
	}
	else
	{
		anim.PlayQueued("Closing");		
		
	}
}//#End

///////////////////////////////////////////////////////////////
//##17
function Foo()  
{//#Begin
//Do not edit this:
jumpTo(23);

}//#End

///////////////////////////////////////////////////////////////
//##18
function DoYouHaveKey()  
{//#Begin

returnValue = gameMaster.DoYouHaveKeys();

}//#End

///////////////////////////////////////////////////////////////
//##19
function DoorIsLocked()  
{//#Begin

	anim.PlayQueued("Locked");
	print("Door locked. You need a key");

}//#End

///////////////////////////////////////////////////////////////
//##20
function Unlocking()  
{//#Begin

	//Tell the game master that you utilised one key	
	gameMaster.DownScoreKey();
	//and start unlocking the door
	anim.PlayQueued("Unlocking");
	

}//#End

///////////////////////////////////////////////////////////////
//##21
function DidUnlockingFinished()  
{//#Begin

returnValue = didUnlockingFinish;

}//#End

///////////////////////////////////////////////////////////////
//##22
function HideLock()  
{//#Begin
			//The door is not longer locked
			isLocked = 0;
			GameObject.Find(gameObject.name + "/Lock").SetActive(false);
	

}//#End

///////////////////////////////////////////////////////////////
//##24
function Dummy()  
{//#Begin
	
}//#End

///////////////////////////////////////////////////////////////
//##25
function _return()  
{//#Begin
	jumpBack();
}//#End


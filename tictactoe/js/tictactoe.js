//Copyright 2011 quarkonium http://www.quarkonium.com 
//Released under the MIT License

var TicTacToe = 
{
  turn: "O",
  gameEnd: false,
  board: ["", "", "", "", "", "", "", "", "", ""],
  patterns: [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]],
  gameWon: function()
  {
    for (i=0; i<this.patterns.length; i++)
    {
      var pattern = this.patterns[i];
      var l = this.board[pattern[0]] + this.board[pattern[1]] + this.board[pattern[2]];
      if(l == "XXX") 
      {
        return "X";  // X won
      } 
      else if(l == "OOO") 
      {
        return "O";  // O won
      }
    }
    
    return "";
  },
  draw: function()
  {
    var squares = 0;
    for(i=0; i<this.board.length; i++)
    {
      if(this.board[i])
      {
        squares+=1;
      }
    }
    if(squares == 9)
    {
      //Draw
      return true;
    }
    else
      return false;
  },
  start: function() 
  {
    var board_table = '<table class="board" cellpadding="0" cellspacing="0"><tr><td id="c0">&nbsp;</td><td id="c1">&nbsp;</td><td id="c2">&nbsp;</td></tr><tr><td id="c3">&nbsp;</td><td id="c4">&nbsp;</td><td id="c5">&nbsp;</td></tr><tr><td id="c6">&nbsp;</td><td id="c7">&nbsp;</td><td id="c8">&nbsp;</td></tr></table>';
    $("#board").html(board_table);
 
    this.board = ["", "", "", "", "", "", "", "", "", ""];
    
    this.gameEnd=false;
    Engine.next();

    //this.clearGameResult();

    $("#board td").click(function(e) 
    {
      TicTacToe.move( e.target.id );
    });

    $("#game_result").text("");

  },
  clearGameResult: function()
  {
    var text = document.getElementById("game_result");
    text.value="";
  },
  play: function(event)
  {
    var code = Engine.play(event.data.board);
    if(code >= 0)
    {
      var space = $("#" + "c" + code);
      space.html( "X" );
    }
  },
  move: function(id) 
  {
    if(this.gameEnd == false)
    {
      var space = $("#" + id);
      var num = id.replace("c", "");
 
      if (!this.board[num]) 
      {
        space.html( this.turn );
        this.board[num] = this.turn;
        this.nextTurn();
      }
    }
  },
  nextTurn: function() 
  {
    var code = Engine.evaluate(this.board);
    if(code >= 0)
    {
      var space = $("#" + "c" + code);  // Board space table element
      space.html( "X" );
    }

    this.gameEnd=this.endGame();
  },
  log: function(t)
  {
    var text = document.getElementById("game_result");
    text.value = t + "\n";
  },
  endGame: function()
  {
    var p;
    if (this.draw())
    {
      $("#game_result").html("Drawn game... have another go!");
      return true;
    } 
    else if(p=this.gameWon()) 
    {
      if(p.indexOf("O") != -1)
      {
        $("#game_result").html(p + " wins! Congratulations!");
      }
      else if(p.indexOf("X") != -1)
      {
        $("#game_result").html(p + " wins! Really, you should do better! Have another try!");
      }
                
      return true;
    }

    return false;
  }
};
 
$(document).ready(function() 
{
    $("#reset").bind("click", function () { TicTacToe.start();  });
    $("#start").bind("click", {board: TicTacToe.board}, TicTacToe.play);
  TicTacToe.start();
});

//Copyright 2011 quarkonium http://www.quarkonium.com 
//Released under the MIT License

var Engine = 
{
  turn: "X", //Computer plays X by default
  p2: "O",
  sequence_number: 0,
  log_number: 0,
  //For prototype, assume computer plays X
  patterns: [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]],
  play: function(board)
  {
    //Choose the centre
    board[4]=this.turn;
    return 4;
  }, 
  next: function()
  {
    this.sequence_number++;
    this.log_number=0;
  },
  setTurn: function(turn)
  {
    this.turn=turn;
  },
  log: function(t)
  {
    var text = document.getElementById("machine");
    if(t.indexOf("Thinking") != -1)
    {
      text.value += t + "\n";
    }
    else
    {
      text.value += this.sequence_number + "." + this.log_number + " " + t + "\n";
      this.log_number++;
    }
  },
  start: function()
  {
    this.sequence_number++;
  },
  //returns 0-8 move index
  evaluate: function(board)
  {
    this.log(" Thinking...");

    var p = this.winMove(board);
    if(p != -1)
    {
      this.log(" Found a winning move!!! " + p);
      return p;
    }    

    var p = this.inCheck(board)
    if(p != -1)
    {
      this.log(" Oh Oh I'm in check, block it... " + p);
      return p;
    }

    var p = this.centreAvailable(board);
    if(p != -1)
    {
      this.log(" I'll choose the centre... ");
      return p;
    }

    var p1 = this.checkCorners(board);
    var p2 = this.selectMid(board);
    this.log("Comparing corner and mid scores ");
    this.log("corner position " + p1[0]);
    this.log("corner score " + p1[1]);
    this.log("mid position " + p2[0]);
    this.log("mid score " + p2[1]);
  
    //Compare the remaining candidates, at least one will be
    //available
    if(p1[0] != -1 && p2[0] == -1)
    {
      board[p1[0]] = this.turn;
      return p1[0];
    }
    else if(p1[0] == -1 && p2[0] != -1)
    {
      board[p2[0]] = this.turn;
      return p2[0];
    }
    if(p1[0] != -1 && p2[0] != -1)
    {
      //Compare for the higher score
      if(p1[1] >= p2[1])
      {
        this.log(" I'll take the corner... " + p1[0]);
        this.log(" corner score " + p1[1]);
        board[p1[0]] = this.turn;
        return p1[0];
      }
      else
      {
        this.log(" I'll take the mid square in this case... " + p2[0]);
        this.log(" mid square score... " + p2[1]);
        board[p2[0]] = this.turn;
        return p2[0];
      }
    }

    return -1;
  },
  inCheck: function(board)
  {
    var oCount = 0;
    var pos = -1;
    //rows
    for(i=0; i<9; i+=3)
    {
      oCount = 0;
      pos = -1;
      for(j=i; j<3+i; j++)
      {
        if(board[j] == this.p2)
        {
          oCount++;
        }
        else if(board[j] == "")
        {
          pos=j;
        }
      }

      if(oCount == 2 && pos > -1)
      {
        //in check
        board[pos]=this.turn; 
        return pos;
      }
    }  

    //columns
    for(j=0; j<3; j++)
    {
      oCount = 0;
      pos = -1;
      for(i=j; i<9; i+=3)
      {
        if(board[i] == this.p2)
        {
          oCount++;
        }
        else if(board[i] == "")
        {
          pos=i;
        }
      }

      if(oCount==2 && pos > -1)
      {
        //in check
        board[pos]=this.turn;
        return pos;
      }
    }  

    //Diagonals
    oCount=0;
    pos=-1;
    for(i=0; i<9; i+=4)
    {
      if(board[i] == this.p2)
      {
        oCount++;
      }
      else if(board[i] == "")
      {
        pos=i;
      }
    }
    
    if(oCount == 2 && pos > -1)
    {
      //in check
      board[pos]=this.turn;
      return pos;
    }

    oCount=0;
    pos=-1;
    for(i=2; i<=6; i+=2)
    {
      if(board[i] == this.p2)
      {
        oCount++;
      }
      else if(board[i] == "")
      {
        pos=i;
      }
    }
    
    if(oCount == 2 && pos > -1)
    {
      //in check
      board[pos]=this.turn;
      return pos;
    }

    //not in check
    return -1;
  },
  winMove: function(board)
  {
    //Check whether there is a win in one move
    var xCount = 0;
    var pos = -1;
    //rows
    for(i=0; i<9; i+=3)
    {
      xCount = 0;
      pos = -1;
      for(j=i; j<3+i; j++)
      {
        if(board[j] == this.turn)
        {
          xCount++;
        }
        else if(board[j] == "")
        {
          pos=j;
        }
      }

      if(xCount == 2 && pos > -1)
      {
        //wins
        board[pos]=this.turn; 
        return pos;
      }
    }  

    //columns
    for(j=0; j<3; j++)
    {
      xCount = 0;
      pos = -1;
      for(i=j; i<9; i+=3)
      {
        if(board[i] == this.turn)
        {
          xCount++;
        }
        else if(board[i] == "")
        {
          pos=i;
        }
      }

      if(xCount==2 && pos > -1)
      {
        //wins
        board[pos]=this.turn;
        return pos;
      }
    }  

    //Diagonals
    xCount=0;
    pos=-1;
    for(i=0; i<9; i+=4)
    {
      if(board[i] == this.turn)
      {
        xCount++;
      }
      else if(board[i] == "")
      {
        pos=i;
      }
    }
    
    if(xCount == 2 && pos > -1)
    {
      //wins 
      board[pos]=this.turn;
      return pos;
    }

    xCount=0;
    pos=-1;
    for(i=2; i<=6; i+=2)
    {
      if(board[i] == this.turn)
      {
        xCount++;
      }
      else if(board[i] == "")
      {
        pos=i;
      }
    }
    
    if(xCount == 2 && pos > -1)
    {
      //wins 
      board[pos]=this.turn;
      return pos;
    }

    //no winning move 
    return -1;
  },
  centreAvailable: function(board)
  {
    if(board[4] == "")
    {
      board[4]=this.turn;
      return 4;
    }
  
    return -1;
  },
  checkCorners: function(board)
  {
    //0, 2, 6, 8
    var corner_point = [0, 0, 0, 0];
    if(board[0] == "")
    {
      corner_point[0]+=1;

      if(board[1] != this.p2 && board[2] != this.p2)
      {
        corner_point[0]+=1;
        
        if(board[1] == this.turn || board[2] == this.turn)
        {
          corner_point[0]+=1;
        }
      }

      if(board[3] != this.p2 && board[6] != this.p2)
      {
        corner_point[0]+=1;
        
        if(board[3] == this.turn || board[6] == this.turn)
        {
          corner_point[0]+=1;
        }
      }

      //Check the diagonal
      if(board[4] != this.p2 && board[8] != this.p2)
      {
        corner_point[0]+=1;

        if(board[4] == this.turn || board[8] == this.turn)
        {
          corner_point[0]+=1;
        }
      }
    }

    if(board[2] == "")
    {
      corner_point[1]+=1;

      if(board[0] != this.p2 && board[1] != this.p2)
      {
        corner_point[1]+=1;
        
        if(board[0] == this.turn || board[1] == this.turn)
        {
          corner_point[1]+=1;
        }
      }

      if(board[5] != this.p2 && board[8] != this.p2)
      {
        corner_point[1]+=1;
        
        if(board[5] == this.turn || board[8] == this.turn)
        {
          corner_point[1]+=1;
        }
      }

      //Check the diagonal
      if(board[4] != this.p2 && board[6] != this.p2)
      {
        corner_point[1]+=1;

        if(board[4] == this.turn || board[6] == this.turn)
        {
          corner_point[1]+=1;
        }
      }
    }

    if(board[6] == "")
    {
      corner_point[2]+=1;

      if(board[0] != this.p2 && board[3] != this.p2)
      {
        corner_point[2]+=1;
        
        if(board[0] == this.turn || board[3] == this.turn)
        {
          corner_point[2]+=1;
        }
      }

      if(board[7] != this.p2 && board[8] != this.p2)
      {
        corner_point[2]+=1;
        
        if(board[7] == this.turn || board[8] == this.turn)
        {
          corner_point[2]+=1;
        }
      }

      //Check the diagonal
      if(board[4] != this.p2 && board[2] != this.p2)
      {
        corner_point[2]+=1;

        if(board[4] == this.turn || board[2] == this.turn)
        {
          corner_point[2]+=1;
        }
      }
    }

    if(board[8] == "")
    {
      corner_point[3]+=1;

      if(board[2] != this.p2 && board[5] != this.p2)
      {
        corner_point[3]+=1;
        
        if(board[2] == this.turn || board[5] == this.turn)
        {
          corner_point[3]+=1;
        }
      }

      if(board[6] != this.p2 && board[7] != this.p2)
      {
        corner_point[3]+=1;
        
        if(board[6] == this.turn || board[7] == this.turn)
        {
          corner_point[3]+=1;
        }
      }

      //Check the diagonal
      if(board[4] != this.p2 && board[0] != this.p2)
      {
        corner_point[3]+=1;

        if(board[4] == this.turn || board[0] == this.turn)
        {
          corner_point[3]+=1;
        }
      }
    }

    var max=0;
    var index=0;
    for(i=0; i<4; i++)
    {
      if(corner_point[i] > max)
      {
        max=corner_point[i];
        index=i;
      }
    }

    var pos_score = [0, 0];
    if(max > 0)
    {
      //A corner is available, select the one with the highest number of points
      var corners = [0, 2, 6, 8];
      pos_score[0]=corners[index];
      pos_score[1]=max;
      return pos_score;
    }
    
    //No corner is available
    pos_score[0]=-1;
    pos_score[1]=-1;

    return pos_score;
  },
  selectMid: function(board)
  {
    var mid_point = [0, 0, 0, 0];

    if(board[1] == "")
    {
      mid_point[0]+=1;
      this.log("Analysing mid 1, available add 1 point " + mid_point[0]);

      if(board[4] != this.p2 && board[7] != this.p2)
      {
        mid_point[0]+=1;
        this.log("Analysing mid 1, column open add 1 point " + mid_point[0]);
        
        if(board[4] == this.turn || board[7] == this.turn)
        {
          mid_point[0]+=1;
          this.log("Analysing mid 1, column link add 1 point " + mid_point[0]);
        }
      }

      if(board[0] != this.p2 && board[2] != this.p2)
      {
        mid_point[0]+=1;
        this.log("Analysing mid 1, row open add 1 point " + mid_point[0]);
          
        if(board[0] == this.turn || board[2] == this.turn)
        {
          mid_point[0]+=1;
          this.log("Analysing mid 1, row open link add 1 point " + mid_point[0]);
          this.log("board[0] : " + board[0]);
          this.log("board[2] : " + board[2]);
        }
      }

      this.log("Analysed mid 1, score is " + mid_point[0]);
    }

    if(board[3] == "")
    {
      mid_point[1]+=1;

      if(board[0] != this.p2 && board[6] != this.p2)
      {
        mid_point[1]+=1;
        
        if(board[0] == this.turn || board[6] == this.turn)
        {
          mid_point[1]+=1;
        }
      }

      if(board[4] != this.p2 && board[5] != this.p2)
      {
        mid_point[1]+=1;
        
        if(board[4] == this.turn || board[5] == this.turn)
        {
          mid_point[1]+=1;
        }
      }
    }

    if(board[5] == "")
    {
      mid_point[2]+=1;

      if(board[2] != this.p2 && board[8] != this.p2)
      {
        mid_point[2]+=1;
        
        if(board[2] == this.turn || board[8] == this.turn)
        {
          mid_point[2]+=1;
        }
      }

      if(board[4] != this.p2 && board[3] != this.p2)
      {
        mid_point[2]+=1;
        
        if(board[4] == this.turn || board[3] == this.turn)
        {
          mid_point[2]+=1;
        }
      }
    }

    if(board[7] == "")
    {
      mid_point[3]+=1;

      if(board[4] != this.p2 && board[1] != this.p2)
      {
        mid_point[3]+=1;
        
        if(board[4] == this.turn || board[1] == this.turn)
        {
          mid_point[3]+=1;
        }
      }

      if(board[6] != this.p2 && board[8] != this.p2)
      {
        mid_point[3]+=1;
        
        if(board[6] == this.turn || board[8] == this.turn)
        {
          mid_point[3]+=1;
        }
      }
    }

    var max=0;
    var index=0;
    for(i=0; i<4; i++)
    {
      if(mid_point[i] > max)
      {
        max=mid_point[i];
        index=i;
      }
    }

    var pos_score = [0, 0];
    if(max > 0)
    {
      //A mid point is available, select the one with the highest number of points
      var mid = [1, 3, 5, 7];
      pos_score[0]=mid[index];
      pos_score[1]=max;
      return pos_score;
    }

    pos_score[0]=-1;
    pos_score[1]=-1;

    return pos_score;
  }
};

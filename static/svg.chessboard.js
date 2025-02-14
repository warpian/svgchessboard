
/**
 * SvgChessBoard - v0.0.1 - 03/08/2016
 * {homepage}
 * Copyright (c) 2016 Philip Sylvain
 * Licensed MIT
 */

function SvgChessBoard(id, options)
{
    this.options = {
        coords : false,
        margin : 30,
        themePath : '/themes',
        squareStyle : 'aluminium',
        pieceStyle : 'merida',
        comment : {
            defaultColor : '#00ff00',
            altColor : '#ffff00',
            shiftColor : '#FF0000'
        }
    };

    if (options) {
        for (var key in options) {
            if (this.options[key]) {
                this.options[key] = options[key];
            }
        }
    }

    this.coordinates = [
        'a8','b8','c8','d8','e8','f8','g8','h8',
        'a7','b7','c7','d7','e7','f7','g7','h7',
        'a6','b6','c6','d6','e6','f6','g6','h6',
        'a5','b5','c5','d5','e5','f5','g5','h5',
        'a4','b4','c4','d4','e4','f4','g4','h4',
        'a3','b3','c3','d3','e3','f3','g3','h3',
        'a2','b2','c2','d2','e2','f2','g2','h2',
        'a1','b1','c1','d1','e1','f1','g1','h1'
    ];

    this.angle = 0;

    this.boardSize = 1600;

    this.squareSize = this.boardSize / 8;

    this.pieceSize = 132;

    var viewBoxSize = this.boardSize + (2 * this.options.margin);

    this.draw = SVG(id);

    this.draw.viewbox(0, 0, viewBoxSize, viewBoxSize);
    var that = this;

    var boardGroup = this.draw.group();
    boardGroup.id('board-group');

    // White square pattern
    var wSquarePattern = this.draw.pattern(this.squareSize, this.squareSize, function(add) {
        var image = add.image(that.options.themePath + '/board/'+ that.options.squareStyle +'.png', 200, 400);
        image.attr({x: 0, y: 0});
    });

    wSquarePattern.attr({
        'class' : 'white square-pattern',
        x : this.options.margin,
        y : this.options.margin
    });

    // Black square pattern
    var bSquarePattern = this.draw.pattern(this.squareSize, this.squareSize, function(add) {
        var image = add.image(that.options.themePath +'/board/'+ that.options.squareStyle +'.png', 200, 400);
        image.attr({x: 0, y: -200});
    });

    bSquarePattern.attr({
        'class' : 'black square-pattern',
        x : this.options.margin,
        y : this.options.margin
    });

    // Generate Squares
    for (var i = 0, col = 0, x = this.options.margin, y = this.options.margin, fill = 0; i < this.coordinates.length; i++) {

        var square = this.draw.rect(this.squareSize, this.squareSize);
        square.attr({
            'x' : x,
            'y' : y,
            'fill' : (fill) ? bSquarePattern : wSquarePattern,
            'class' : 'drop square ' + (fill ? 'black' : 'white'),
            'id' : this.coordinates[i],
            'pointer-events' : 'all'
        });
        square.remember('square', this.coordinates[i]);

        var color = this.draw.rect(this.squareSize, this.squareSize);
        color.attr({
            'x' : x,
            'y' : y,
            'fill' : 'transparent',
            'class' : 'color',
            'pointer-events' : 'none'
        });

        square.on('mousedown', function(e) {
            if (e.ctrlKey) {
                this.doc().remember('commentFrom', this.remember('square'));
            }
        });

        square.on('mouseup', function(e) {
            if (e.ctrlKey) {
                this.doc().fire('comment', {
                    event: e,
                    from : this.doc().remember('commentFrom'),
                    to : this.remember('square')
                });
            }
        });

        var squareGroup = this.draw.group();
        boardGroup.add(squareGroup);
        squareGroup.attr({
            'id' : 'g-' + this.coordinates[i],
        });

        squareGroup.add(square);
        squareGroup.add(color);

        col++;
        x += this.squareSize;
        fill = ~fill;

        if (col > 7) {
            col = 0;
            x = this.options.margin;
            y += this.squareSize;
            fill = ~fill;
        }
    }

    // Pieces pattern
    var imageOptions = {
        'href' : this.options.themePath +'/pieces/'+ this.options.pieceStyle +'.png',
        x : 0,
        y : 0,
        width :  this.pieceSize * 6,
        height : this.pieceSize * 2
    };

    // Pieces disposition in PNG theme
    var pieces = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Pawn'];

    var side='w';

    var addImage = function(add) {
        var image = add.image(imageOptions.href, imageOptions.width, imageOptions.height);
        image.attr({x: imageOptions.x, y: imageOptions.y});
    };

    for (i=0; i < pieces.length ; i++) {
        var pattern = this.draw.pattern(this.pieceSize, this.pieceSize, addImage);

        pattern.id(side+pieces[i]+'Pattern');
        pattern.addClass('piece-pattern');

        var symbol = this.draw.symbol();
        symbol.id(side+pieces[i]);
        pattern.addClass('piece-symbol');
        symbol.viewbox(0, 0, this.pieceSize, this.pieceSize);

        symbol.rect(this.pieceSize, this.pieceSize).fill(pattern);

        if (side == 'w') {
            i--;
            side = 'b';
            imageOptions.y -= this.pieceSize;
        } else {
            side = 'w';
            imageOptions.y = 0;
            imageOptions.x -= this.pieceSize;
        }
    }

    // Generate coordinates

    var coordsGroup = this.draw.group();
    boardGroup.add(coordsGroup);

    coordsGroup.id('coordinates');

    var coords = ['A','B','C','D','E','F','G','H'];
    var middleMargin = this.options.margin / 2;

    for (i=0, c=8, x=this.options.margin+(this.squareSize/2), y=this.options.margin+(this.squareSize/2); i < 8; i++) {

        var row = this.draw.element('text').words(coords[i]).attr({
            'class' : 'coords',
            'x' : x,
            'y' : middleMargin,
            'dominant-baseline' : 'middle'
        });

        var column = this.draw.element('text').words(c + '').attr({
            'class' : 'coords',
            'x' : middleMargin,
            'y' : y,
            'text-anchor' : 'middle'
        });

        var row2 =  row.clone().y(this.boardSize + this.options.margin + middleMargin);
        var column2 =  column.clone().x(this.boardSize + this.options.margin + middleMargin);

        coordsGroup.add(row);
        coordsGroup.add(column);
        coordsGroup.add(row2);
        coordsGroup.add(column2);

        x += this.squareSize;
        y += this.squareSize;

        c--;
    }

    this.draw.on('comment', function(e) {

        var from = e.detail.from,
            to   = e.detail.to,
            event = e.detail.event,
            color = that.options.comment.defaultColor;

        if (event.altKey)
        {
            color = that.options.comment.altColor;
        }
        else if (event.shiftKey)
        {
            color = that.options.comment.shiftColor;
        }

        if (from == to) {
            that.toggleSquareColor(from, color);
        }
        else {
            that.drawArrow(from, to, color);
        }
    });

}


SvgChessBoard.prototype = {

    addPiece : function(type, square)
    {
        var boardGroup = SVG.get('board-group');
        var squareBg = SVG.get(square);
        var symbol = SVG.get(type);

        var piece = this.draw.use(symbol).attr({
            'x' : squareBg.x(),
            'y' : squareBg.y(),
            'width' : squareBg.width(),
            'height' : squareBg.height(),
            'class' : 'drop piece'
        });

        boardGroup.add(piece);

        piece.remember('pieceType', type);
        piece.remember('square', square);

        piece.draggable();

        piece.on('beforedrag', function(e) {

            if (e.detail.event.ctrlKey) {
                // Start a comment if Ctrl key is down
                this.doc().remember('commentFrom', this.remember('square'));
            }

            // Turn off all pointer events to the dragged element, this does 2
            // things:
            // 1) allows us to drag text elements without selecting the text
            // 2) allows us to find out where the dragged element is dropped
            this.attr('pointer-events', 'none');

            // Move this element to the "top" of the display
            this.front();
        });

        piece.on('dragmove', function(e){
            if (e.detail.event.ctrlKey) {
                // Don't move if Ctrl key is down
                e.preventDefault();
            }
        });

        piece.on('dragend', function(e) {

            // Restore pointer-events
            this.attr('pointer-events', null);

            // Since the element currently being dragged has its pointer-events turned off,
            // we are afforded the opportunity to find out the element it's being dropped on
            var targetElement = e.detail.event.target.instance;

            var squareTo,
                squareFrom = this.remember('square'),
                canDrop = false;

            if (targetElement.hasClass('drop')) {
                canDrop = true;
                squareTo = targetElement.remember('square');
            }

            // Don't move if Ctrl key is down
            if (e.detail.event.ctrlKey) {
                if (targetElement.hasClass('piece')) {
                    this.doc().fire('comment', {
                        event: e,
                        from : this.doc().remember('commentFrom'),
                        to : squareTo
                    });
                }
                return;
            }

            var eventDetail = {
                event: e,
                piece: this,
                candrop: canDrop,
                move: {
                    piece: this.remember('pieceType'),
                    from: squareFrom,
                    to: squareTo
                },
            };

            var event = new CustomEvent('beforedrop', {
                detail: eventDetail,
                cancelable: true
            });

            this.doc().fire(event);

            if (event.detail.candrop) {
                this.x(targetElement.x());
                this.y(targetElement.y());
                if (targetElement.hasClass('piece')) {
                    targetElement.remove();
                }
                this.remember('square', squareTo);

                this.doc().fire('afterdrop', eventDetail);

            } else {
                // The piece go back to its start points
                this.x(e.detail.handler.startPoints.box.x);
                this.y(e.detail.handler.startPoints.box.y);
            }
        });

    },

    removePiece : function(square)
    {
        var pieces = this.draw.select('.piece');
        pieces.each(function(i) {
            if (this.remember('square') == square) {
                this.remove();
            }
        });
    },

    movePiece : function(from, to)
    {
        if (from == to) {
            return;
        }

        var pieces = this.draw.select('.piece');
        var pieceToMove = null;
        var targetElement = null;

        pieces.each(function(i) {
            if (this.remember('square') == from) {
                pieceToMove = this;
            }
            if (this.remember('square') == to) {
                targetElement = this;
            }
        });

        if (!targetElement) {
            // Square
            targetElement = SVG.get(to);
        }

        if (pieceToMove && targetElement) {
            pieceToMove.remember('square', to);
            pieceToMove.x(targetElement.x());
            pieceToMove.y(targetElement.y());

            if (targetElement.hasClass('piece')) {
                targetElement.remove();
            }
        }

    },

    empty : function()
    {

    },

    toggleSquareColor : function(square, color, opacity)
    {
        if (!opacity) opacity = 0.5;

        var squareElt = SVG.get('g-' + square).select('.color').first();

        if (squareElt.attr('fill') == 'transparent') {
            squareElt.attr({
                'fill': color,
                'opacity': opacity
            });
        } else {
            squareElt.attr({
                'fill': 'transparent',
                'opacity': null
            });
        }
    },

    drawArrow : function(fromSquare, toSquare, color, opacity)
    {
        var lineId = 'arrow-'+fromSquare+toSquare;

        if (SVG.get(lineId)) {
            SVG.get(lineId).remove();
            return;
        }

        if (!opacity) opacity = 0.5;

        var from = {
            x : SVG.get(fromSquare).x() + (this.squareSize / 2),
            y : SVG.get(fromSquare).y() + (this.squareSize / 2)
        };

        var to = {
            x : SVG.get(toSquare).x() + (this.squareSize / 2),
            y : SVG.get(toSquare).y() + (this.squareSize / 2)
        };

        var boardGroup = SVG.get('board-group');

        var line = this.draw.line(from.x, from.y, to.x, to.y).stroke({ width: 15, color: color, opacity: opacity });
        boardGroup.add(line);
        line.id(lineId);
        line.attr({
            'class': 'arrow',
            'pointer-events': 'none'
        });

        line.marker('end', 4, 4, function(add) {
            add.polygon('0,0 0,4 4,2').fill(color).opacity(opacity + 0.2);
            this.ref(0,2);
        });
    },

    rotate : function()
    {
        this.angle = (this.angle === 0)? 180 : 0;
        var that = this;
        var boardGroup = SVG.get('board-group');

        // Rotate main group
        boardGroup.rotate(this.angle);

        // Rotate coordinates
        var coords = SVG.get('coordinates').select('text.coords');
        coords.each(function(i) {
            this.rotate(that.angle);
        });

        // Rotate piece symbols because use element remove transformations after deplacement
        var symbols = this.draw.defs().select('.piece-symbol');
        symbols.each(function(i) {
            this.rotate(that.angle);
        });
    },

    setSquareStyle : function(style)
    {
        this.options.squareStyle = style;
        var that = this;
        var setPattern = this.draw.defs().select('pattern.square-pattern');
        var wSquarePattern = this.draw.defs().select('pattern.white.square-pattern').first();
        var bSquarePattern = this.draw.defs().select('pattern.black.square-pattern').first();

        setPattern.each(function(i) {
            this.first().load(that.options.themePath + '/board/'+ that.options.squareStyle +'.png');
        });

        var wSquares = SVG.get('board-group').select('.square');
        wSquares.each(function(i) {
            if (this.hasClass('white'))
                this.fill(wSquarePattern);
            else
                this.fill(bSquarePattern);
        });
    },

    setSquaresColor : function(wColor, bColor)
    {
        var squares = SVG.get('board-group').select('.square');
        squares.each(function(i) {
            if (wColor && this.hasClass('white')) this.fill(wColor);
            if (bColor && this.hasClass('black')) this.fill(bColor);
        });
    },

    setPieceStyle : function(style)
    {
        this.options.pieceStyle = style;
        var that = this;
        var setPattern = this.draw.defs().select('pattern.piece-pattern');
        setPattern.each(function(i) {
            this.first().load(that.options.themePath +'/pieces/'+ that.options.pieceStyle +'.png');
        });
    },

    on : function(eventName, eventListener)
    {
        this.draw.on(eventName, eventListener);
    }

};




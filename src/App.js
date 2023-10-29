import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";
import { Flip } from 'gsap/Flip';
import { Button, Container, FloatingLabel, FormControl, Stack } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

gsap.registerPlugin(Draggable, Flip) 

const style = () => {
  const randomBetween = (min, max) => {
    return min + Math.ceil(Math.random() * max);
  };
  
  const style = {
    left: randomBetween(0, window.innerWidth - 150) + 'px',
    top: randomBetween(0, window.innerHeight - 150) + 'px',
    transform: 'rotate(' + randomBetween(-15, 15) + 'deg)',
  };
  return style
}

const flip = (from, to) => {
  const flipFrom = document.querySelector(from)
  const flipTo = document.querySelector(to)
  const state = Flip.getState(from + ', ' + to);
  flipFrom.classList.toggle("flipActive");
  flipTo.classList.toggle("flipActive");
  Flip.from(state, {
    duration: 0.6,
    fade: true,
    scale: true,
    absolute: true,
    toggleClass: "flipping",
    ease: "power3.inOut"
  });
}

const Note = ({ index, children, style, onRemove, drag, modify, state }) => {
    useEffect(()=>{
      Draggable.create(".note",{
        onDragEnd: function(e) {
          const target = e.target.closest('.note');
          const index = target.getAttribute('data-index');

          drag(target.style.transform, index)
        }
      });
    },[drag])

    const remove = () => {
        onRemove(index);
    };

    const modifyTarget = (e) => {
      const target = e.target.closest('.note')
      const modifyTarget = `.${target.classList[1]}`
      modify(modifyTarget, '.flipForm', index)
    }

    if(state){
      return (
          <div className={'note flipIndex' + index} style={style} data-index={index} data-flip-id="flipform">
              <p>{children}</p>
              <p>{index}</p>
              <p>{state.toString()}</p>
              <span>
                  <button onClick={modifyTarget} className="btn btn-primary glyphicon glyphicon-pencil" />
                  <button onClick={remove} className="btn btn-danger glyphicon glyphicon-trash" />
              </span>
          </div>
      );
    }else{
      return (
          <div className={'note flipIndex' + index + ' dumyNote'} style={style} data-index={index} data-flip-id="flipform">
              <p>{children}</p>
              <p>{index}</p>
              <p>{state.toString()}</p>
              <span>
                  <button onClick={modifyTarget} className="btn btn-primary glyphicon glyphicon-pencil" />
                  <button onClick={remove} className="btn btn-danger glyphicon glyphicon-trash" />
              </span>
          </div>
      );
    }
};
const NoteFlip = ({textsave, flipOut,modifyText}) => {
  const [noteText, setNoteText] = useState('');
  // useEffect(()=>{
  //   setNoteText()
  // },[])
  const save = () => {
    textsave(noteText)
    setNoteText('')
  }
  const cancel = () => {
    flipOut()
  }

  return (
    <Container mx='auto' className='flipForm mw-70 p-4 rounded-4 position-fixed bg-warning-subtle' data-flip-id="flipform" style={{ maxWidth:'720px', zIndex:'3000'}}>
      <Stack direction="horizontal">
        <div className='username px-3 mb-3'>작성자</div>
        <div className='date ms-auto px-3 mb-3'>날짜</div>
      </Stack>
      <FloatingLabel className='mb-4' controlId="noteText" label='방명록을 작성해주세요'>
        <FormControl as="textarea" placeholder="Leave a comment here" style={{ height: '300px' }} value={noteText} onChange={(e) => setNoteText(e.target.value)}></FormControl>
      </FloatingLabel>
      <Stack direction='horizontal'>
        <Button className='me-2 ms-auto' onClick={save}>save</Button>
        <Button onClick={cancel}>cancel</Button>
      </Stack>
    </Container>
  )
}
const Board = () => {
    const savenotes = JSON.parse(localStorage.getItem('bbs_data_style'));
    const [notes, setNotes] = useState(savenotes || [{id:0, note:'', style:style()}]);
    const [id, setId] = useState(0);
    const [FlipArry, setFlip] = useState([]);
    
    useEffect(() => {
      if (savenotes && savenotes.length !== 0) {
        setId(savenotes.slice(-1)[0].id + 1);
      } else {
        setId(0);
      }
    }, [savenotes]);

    useEffect(()=>{
      localStorage.setItem('bbs_data_style', JSON.stringify(notes));
    },[notes])
    
    const remove = (i) => {
      const updatedNotes = notes.filter(note => note.id !== i);
      setNotes(updatedNotes);
    };
    
    const dragset = (transform, i) => {
      const Localnotes = JSON.parse(localStorage.getItem('bbs_data_style'));
      const updatedNotes = Localnotes.map(note => {
        if (note.id === parseInt(i)) {
          return { ...note, style:{...note.style, transform:transform} };
        }
        return note;
      });
      setNotes(updatedNotes);
    }

    const flipOut = () => {
      flip(FlipArry[0], FlipArry[1])
      if(FlipArry[0] === '.createBtn'){
        remove(id-1)
        setId(id-1)
      }
    }


    const update = (newText, i) => {
      const updatedNotes = notes.map(note => {
        if (note.id === i) {
          return { ...note, note:newText, state:true};
        }
        return note;
      });
      setNotes(updatedNotes);
    };

    const noteSave = (noteText) => {
      if(FlipArry[0] === '.createBtn'){
        flip('.flipIndex'+(id-1), FlipArry[1])
        update(noteText, id-1)
      }else{
        flip(FlipArry[0], FlipArry[1])
        update(noteText, FlipArry[2])
      }
    }

    const creatNote = () => {
      setId(id+1)
      setNotes([...notes, { id: id, style: style(), state:false}]);
      flip('.createBtn','.flipForm')
      setFlip(['.createBtn','.flipForm'])
    }

    const modify = (from, to, index) => {
      flip(from, to)
      setFlip([from, to, index])
    }

    return (
        <div className="board">
            {notes.map((note) => (
                <Note key={note.id} index={note.id} length={id} style={note.style} state={note.state} drag={dragset} modify={modify} onRemove={remove}>
                    {note.note}
                </Note>
            ))}
            <button className="createBtn btn btn-sm btn-success glyphicon glyphicon-plus" data-flip-id="flipform" onClick={creatNote} />
            <NoteFlip textsave={noteSave} flipOut={flipOut}></NoteFlip>
        </div>
    );
};

export default Board;

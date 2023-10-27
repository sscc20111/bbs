import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Draggable, Flip) 

const Note = ({ index, children, style, onChange, onRemove, testset }) => {
    const [editing, setEditing] = useState(false);

    useEffect(()=>{
      Draggable.create(".note",{
        onDragEnd: function(e) {
          const target = e.target.closest('.note');
          const index = target.getAttribute('data-index');

          testset(target.style.transform, index)
        }
      });
    },[setEditing])

    const edit = (e) => {
        setEditing(true);
        Draggable.get(e.target.closest('.note')).disable();
      };
      
      const save = (e) => {
        onChange(newTextRef.current.value, index);
        setEditing(false);
        Draggable.get(e.target.closest('.note')).enable();
    };

    const remove = () => {
        onRemove(index);
    };

    const newTextRef = useRef();

    if (editing) {
        return (
            <div className="note" style={style} data-index={index}>
                <textarea ref={newTextRef} defaultValue={children} className="form-control"></textarea>
                <button onClick={save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
            </div>
        );
    } else {
        return (
            <div className="note" style={style} data-index={index}>
                <p>{children}</p>
                <p>{index}</p>
                <span>
                    <button onClick={edit} className="btn btn-primary glyphicon glyphicon-pencil" />
                    <button onClick={remove} className="btn btn-danger glyphicon glyphicon-trash" />
                </span>
            </div>
        );
    }
};

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

const Board = () => {
    const savenotes = JSON.parse(localStorage.getItem('bbs_data_style'));
    const [notes, setNotes] = useState(savenotes || []);
    const [id, setId] = useState(0);
    useEffect(() => {
      if (savenotes && savenotes.length !== 0) {
        setId(savenotes.slice(-1)[0].id + 1);
      } else {
        setId(0);
      }
      console.log(id)
    }, []);
    const add = (text) => {
        setNotes([...notes, { id: id+1, note: text, style: style()}]);
        setId(id+1)
    };

    const update = (newText, i) => {
      const updatedNotes = notes.map(note => {
        if (note.id === parseInt(i)) {
          return { ...note, note:newText };
        }
        return note;
      });
      setNotes(updatedNotes);
    };
    
    const remove = (i) => {
      const updatedNotes = notes.filter(note => note.id !== i);
      setNotes(updatedNotes);
    };
    
    const test = (transform, i) => {
      const test = JSON.parse(localStorage.getItem('bbs_data_style'));
      const updatedNotes = test.map(note => {
        if (note.id === parseInt(i)) {
          return { ...note, style:{...note.style, transform:transform} };
        }
        return note;
      });
      setNotes(updatedNotes);
    }
    
    useEffect(()=>{
      localStorage.setItem('bbs_data_style', JSON.stringify(notes));
    },[add, remove, test])
    
    // const fliptest = () => {
    //   const flipbtn = document.querySelector('.flipTestBtn')
    //   const flipContent = document.querySelector('.flipTestContent')
    //   const state = Flip.getState(".flipTestBtn, .flipTestContent");
    //   flipbtn.classList.toggle("active");
    //   flipContent.classList.toggle("active");
    //   Flip.from(state, {
    //     duration: 2,
    //     fade: true,
    //     absolute: true,
    //     toggleClass: "flipping",
    //     ease: "power1.inOut"
    //   });
    //   console.log('flip')
    // }
    // const fliptest2 = () => {
    //   const flipbtn = document.querySelector('.flipTestBtn2')
    //   const flipContent = document.querySelector('.flipTestContent')
    //   const state = Flip.getState(".flipTestBtn2, .flipTestContent");
    //   flipbtn.classList.toggle("active");
    //   flipContent.classList.toggle("active");
    //   Flip.from(state, {
    //     duration: 2,
    //     fade: true,
    //     absolute: true,
    //     toggleClass: "flipping",
    //     ease: "power1.inOut"
    //   });
    //   console.log('flip')
    // }

    const createText = () => {
      
    }
    return (
        <div className="board">
            {notes.map((note, index) => (
                <Note key={note.id} index={note.id} style={note.style} testset={test} onChange={update} onRemove={remove}>
                    {note.note}
                </Note>
            ))}
            <button className="btn btn-sm btn-success glyphicon glyphicon-plus" onClick={() => add('New Note')} />
            
            <img className='flipTestContent' onClick={createText} data-flip-id="afawfawf"  src="https://placehold.co/600x600"></img>
            {/* <img className='flipTestBtn' onClick={fliptest} data-flip-id="afawfawf" src="https://placehold.co/200x200"></img>
            <img className='flipTestContent' onClick={fliptest2} data-flip-id="afawfawf"  src="https://placehold.co/600x600"></img>
            <img className='flipTestBtn2' data-flip-id="afawfawf" src="https://placehold.co/200x200"></img> */}
        </div>
    );
};

export default Board;

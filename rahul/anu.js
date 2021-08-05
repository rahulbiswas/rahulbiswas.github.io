const editor = new EditorJS({
    holder: 'editorjs',
 }
);

function myFunction(){
    editor.save().then((output) => {
        console.log('Data: ', output);
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}
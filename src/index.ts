interface Person{
    name: string
}


interface Student extends Person{
    uniqname: string
}

/*
class Student implements Person{
    name: string = ""
    uniqname: string = ""
}
*/

let aStudent:Student = {
    name: "Peter",
    uniqname: "peter"
};

console.log(`aStudent: ${JSON.stringify(aStudent)}`);

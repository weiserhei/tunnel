import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import * as $ from "jquery";
import 'bootstrap';
// add all the icons that are used in this application
library.add(faChevronCircleRight, faCaretDown);

// function findBootstrapEnvironment() {
//     let envs = ['xs', 'sm', 'md', 'lg', 'xl'];

//     let el = document.createElement('div');
//     document.body.appendChild(el);

//     let curEnv = envs.shift();

//     for (let env of envs.reverse()) {
//         el.classList.add(`d-${env}-none`);

//         if (window.getComputedStyle(el).display === 'none') {
//             curEnv = env;
//             break;
//         }
//     }

//     document.body.removeChild(el);
//     return curEnv;
// }


export default class Overlay {
    constructor(title, text, controller) {

        this.domElement = document.createElement("div");
        // this.domElement.className = "bg-light position-absolute fixed-top w-25 mt-4 ml-4 p-5";
        // this.domElement.className = "bg-light position-absolute fixed-top mt-4 mx-4 pt-5 px-5 pb-1 collapse collapseExample card";
        this.domElement.className = "bg-light position-absolute mt-4 mb-2 mx-4 card fixed-top";
        // if( findBootstrapEnvironment() === "xs" ) {
        //     // this.domElement.className += " fixed-bottom";
        // } else {
        //     this.domElement.className += " fixed-top";
        // }
        this.domElement.style.borderRadius = 0;
        this.domElement.style.display = "none";
        const header = document.createElement("div");
        header.className = "card-header font-weight-bold";
        header.style.cursor = "pointer";
        header.setAttribute("data-toggle", "collapse");
        header.setAttribute("data-target", ".collapseExample");
        header.setAttribute("aria-expanded", "true");
        header.setAttribute("aria-controls", "collapseExample");
        header.setAttribute("role", "button");

        const caretDown = icon(faCaretDown, { classes: ["text-primary", "ml-2"] }).html;
        header.innerHTML = title + caretDown;

        // $('.collapse').on('shown.bs.collapse', function(){
        $(this.domElement).on('shown.bs.collapse', function(){
            $(header).find(".fa-caret-down").removeClass("fa-rotate-270")
            // $(this).parent().find(".fa-caret-down").removeClass("fa-rotate-270")
        }).on('hidden.bs.collapse', function(){
            $(header).find(".fa-caret-down").addClass("fa-rotate-270")
            // $(this).parent().find(".fa-caret-down").addClass("fa-rotate-270");
        });

        const content = document.createElement("div");
        content.className = "card-body collapse show collapseExample";

        const close = document.createElement("button");
        // this.close.className = "close mt-n4 mr-n3";
        close.className = "close float-right";
        close.type = "button";
        close.innerHTML = `<span aria-hidden="true">&times;</span>`;

        // this.minimize.onclick = () => console.log( $(".collapseExample") );
        // this.minimize.onclick = () => {
            // $(".collapseExample")[0].collapse();
            // $(".collapseExample").collapse();
        // } 
        // <button class="" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        //     Button with data-target
        // </button>;

        const buttonIcon = icon(faChevronCircleRight, { classes: ["text-white-50", "ml-2"] }).html;

        const button = document.createElement("button");
        button.className = "btn btn-primary btn-icon-split";
        button.innerHTML = "<span class='text'>Weiter</span>" + buttonIcon;

        const p = document.createElement("p");
        p.className = "mt-4";
        // p.appendChild(this.button);

        content.innerHTML =
        text;
        // "<h1>"+title+"</h1>" +
        // "<p>"+text+"</p>";
        // "<p class='mt-4'><button class='btn btn-primary btn-icon-split'>"+
        // "<span class='text'>Weiter</span>"+
        // '<span class="icon text-white-50 ml-2"><i class="fas fa-chevron-circle-right"></i></span>'+
        // buttonIcon +
        // "</button>";
        // content.appendChild(p);
        // content.insertBefore(this.close, content.childNodes[0] || null);
        content.insertBefore(header, content.childNodes[0] || null);

        header.appendChild( close );
        const footer = document.createElement("div");
        footer.className = "card-footer";
        footer.appendChild(button);

        this.domElement.appendChild(header);
        this.domElement.appendChild(content);
        this.domElement.appendChild(footer);

        close.onclick = () => { 
            // overlay.domElement.style.display = "none"; 
            controller.setActive();
        };
        button.onclick = () => { 
            controller.enableNext();
        };

    }
}
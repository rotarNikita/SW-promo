import React from 'react';
import Lng from '../../components/Header/Menu/Lng';

const ruM = (
    <React.Fragment>
        <tspan x={59}>
            SW AGENCY - креативное digital агентство. Мы специализируемся на
        </tspan>
        <tspan x={0} dy="30px">
            интернет-маркетинге, айдентике, мобильной и веб разработке. Умеем слушать и
        </tspan>
        <tspan x={2} dy="30px">
            слышать наших клиентов. Наша команда нацелена на построение долгосрочных
        </tspan>
        <tspan x={13} dy="30px">
            партнерских отношений, основанных на взаимном доверии. Мы не завершаем
        </tspan>
        <tspan x={255} dy="30px">
            проекты - мы заботимся о них.
        </tspan>
    </React.Fragment>
);

const ruS = (
    <React.Fragment>
        SW AGENCY - креативное digital
        агентство. Мы специализируемся на
        интернет-маркетинге, айдентике,
        мобильной и веб разработке. Умеем слушать и
        слышать наших клиентов. Наша команда
        нацелена на построение долгосрочных
        партнерских отношений, основанных
        на взаимном доверии. Мы не завершаем
        проекты - мы заботимся о них.
    </React.Fragment>
);
// const ruS = (
//     <React.Fragment>
//         <tspan x={0}>
//             SW AGENCY - креативное digital
//         </tspan>
//         <tspan x={0} dy="15px">
//             агентство. Мы специализируемся на
//         </tspan>
//         <tspan x={0} dy="15px">
//             интернет-маркетинге, айдентике,
//         </tspan>
//         <tspan x={0} dy="15px">
//             мобильной и веб разработке. Умеем слушать и
//         </tspan>
//         <tspan x={0} dy="15px">
//             слышать наших клиентов. Наша команда
//         </tspan>
//         <tspan x={0} dy="15px">
//             нацелена на построение долгосрочных
//         </tspan>
//         <tspan x={0} dy="15px">
//             партнерских отношений, основанных
//         </tspan>
//         <tspan x={0} dy="15px">
//             на взаимном доверии. Мы не завершаем
//         </tspan>
//         <tspan x={0} dy="15px">
//             проекты - мы заботимся о них.
//         </tspan>
//     </React.Fragment>
// );

const enM = (
    <React.Fragment>
        <tspan x={0}>
            Digital strategy with all its deliverables is our responsibility that we proudly take.
        </tspan>
        <tspan x={0} dy="30px">
            Our clients are entrepreneurs and businessmen. They are smart, brave and charismatic.
        </tspan>
        <tspan x={0} dy="30px">
            The have passion what they build. We cooperate with them in long-term perspective,
        </tspan>
        <tspan x={0} dy="30px">
            creating a successful technological identity.
        </tspan>
    </React.Fragment>
);

const enS = (
    <React.Fragment>
            Digital strategy with all its deliverables
            is our responsibility that we proudly take.
            Our clients are entrepreneurs and businessmen.
            They are smart, brave and charismatic.
            The have passion what they build.
            We cooperate with them in long-term perspective,
            creating a successful technological identity.
    </React.Fragment>
);

// const enS = (
//     <React.Fragment>
//         <tspan x={0}>
//             Digital strategy with all its deliverables
//         </tspan>
//         <tspan x={0} dy="15px">
//             is our responsibility that we proudly take.
//         </tspan>
//         <tspan x={0} dy="15px">
//             Our clients are entrepreneurs and businessmen.
//         </tspan>
//         <tspan x={0} dy="15px">
//             They are smart, brave and charismatic.
//         </tspan>
//         <tspan x={0} dy="15px">
//             The have passion what they build.
//         </tspan>
//         <tspan x={0} dy="15px">
//             We cooperate with them in long-term perspective,
//         </tspan>
//         <tspan x={0} dy="15px">
//             creating a successful technological identity.
//         </tspan>
//     </React.Fragment>
// );

export default () => {
    return ({
        ru() {
            if (window.innerWidth > 768) return ruM;
            return ruS
        },
        en() {
            if (window.innerWidth > 768) return enM;
            return enS;
        }
    })[Lng.currentLng]
};
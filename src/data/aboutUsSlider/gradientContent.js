import React from 'react';
import Lng from '../../components/Header/Menu/Lng';

export default () => ({
    ru: (
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
    ),
    en: (
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
    )
})[Lng.currentLng];
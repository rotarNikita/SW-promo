import React from 'react';
import Lng from '../../components/Header/Menu/Lng';

export default () => ({
    rus: (
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
    eng: ''
})[Lng.currentLng];
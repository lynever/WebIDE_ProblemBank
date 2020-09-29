import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function ProgressPanel(props) {
    return (
        <Wrapper>
            <div className="chart">

            </div>
            <div className="progress__content">
                <div>
                    작업
                </div>
                <div>
                    해결
                </div>
                <div>
                    실패
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 240px;
    border-radius: 4px;
    border: 1px solid #ddd;
    margin-left: 10px;
    .chart{
        height: 200px;
    }
    .progress__content{
        padding: 10px 20px;
        background: #F5F5F5;
        display: flex;
        justify-content: space-between;
    }
`
export default ProgressPanel


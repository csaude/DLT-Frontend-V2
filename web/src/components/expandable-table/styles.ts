import styled from "styled-components";

const Styles = styled.div`
  display: block;
  max-width: 100%;
  padding-top: 1rem;

  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid black;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid #ddd;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
      color: #3c8dbc;
    }
    ,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
    .pagination {
      padding: 0.5rem;
    }
  }
`;
export default Styles;

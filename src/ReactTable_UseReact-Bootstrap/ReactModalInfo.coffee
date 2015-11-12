ModalInfo = React.createClass
              #隐藏时卸载
              componentDidMount:->
                modalContainer = $(@getDOMNode())
                modalContainer.modal("show")
                modalContainer.on "hidden.bs.modal",->
                  React.unmountComponentAtNode(modalContainer.parent()[0])
                  modalContainer.parent().remove()
                if @props.autoClose
                  setTimeout ->
                    modalContainer.modal("hide")
                  ,2000
              confirmButtonClick:(e)->
                debugger
                @props.confirmButtonClick(e)
                if e.isDefaultPrevented()
                  saveBtn = $ React.findDOMNode(@refs.saveBtn)
                  saveBtn.popover(content:e.error,placement:"auto")
                  saveBtn.popover("show")
                else
                  modalContainer = $(@getDOMNode())
                  modalContainer.modal("hide")
              render:->
                <div className='modal fade'>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 className="modal-title" id="mySmallModalLabel">提示</h4>
                      </div>
                      <div className="modal-body text-center">
                          <p style={{fontSize:20}}>{@props.msg}</p>
                      </div>
                      {if @props.autoClose then null else
                        <div className="modal-footer">
                          <button ref={"saveBtn"} type="button" className="btn btn-danger" onClick={@confirmButtonClick}>确定</button>
                          <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
window.ModalInfo = ModalInfo

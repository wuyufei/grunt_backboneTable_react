
_.extend  window, ReactBootstrap




Page = React.createClass
  render:->
      <Grid fluid=true>
        <Row className="show-grid">
          <Col xs={12}>
            <Breadcrumb>
              <BreadcrumbItem>您的位置</BreadcrumbItem>
              <BreadcrumbItem>船舶管理</BreadcrumbItem>
              <BreadcrumbItem active>船舶抵港报</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="船舶" />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Button bsStyle="primary" block>查询</Button>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Button bsStyle="info" block>打印</Button>
          </Col>
        </Row>
      </Grid>
React.render <Page></Page>,$("body")[0]

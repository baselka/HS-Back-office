import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import Api from "../../../src/api";

const Index = () => {
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    _getSubCategories();
  }, []);
  const _getSubCategories = () => {
    Api.Categories.all().then(res => {
      console.log("_getSubCategories", res);
      if (res.statusCode === 200) {
        setSubCategories(res.data);
      }
    });
    console.log("yes", subCategories);
  };
  return (
    <Container>
      <Layout>
        <SectionTitle title='إدارة التطبيق' subtitle='إدارة الأقسام الفرعية' />
        {subCategories &&
          subCategories.map((item, i) => {
            return (
              <div key={i}>
                <img src={item.image_path} alt='image' />
                <p>{item.type_name}</p>
                <p>{item.type_desc}</p>
              </div>
            );
          })}
      </Layout>
    </Container>
  );
};

export default Index;

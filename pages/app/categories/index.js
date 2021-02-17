import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import Api from "../../../src/api";

const Index = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    _getAllCategories();
  }, []);
  const _getAllCategories = () => {
    Api.Categories.all().then(res => {
      console.log("_getAllCategories", res);
      if (res.statusCode === 200) {
        setCategories(res.data);
      }
    });
    console.log("yes", categories);
  };
  return (
    <Container>
      <Layout>
        <SectionTitle title='إدارة التطبيق' subtitle='إدارة الأقسام الرئيسية' />
        {categories &&
          categories.map((item, i) => {
            return (
              <div key={i}>
                <p>{item.type_name}</p>
                <p>{item.type_desc}</p>
                <img src={item.image_path} alt='image' />
              </div>
            );
          })}
      </Layout>
    </Container>
  );
};

export default Index;

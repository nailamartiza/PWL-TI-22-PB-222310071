import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";

function FormDataDiri() {
  const [formData, setFormData] = useState({
    npm: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthdate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [age, setAge] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "npm" && (!/^\d*$/.test(value) || value.length > 10)) return;

    setFormData({ ...formData, [name]: value });
  };

  const calculateAge = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.npm || !formData.firstName || !formData.lastName || !formData.birthdate) {
      alert("Semua field wajib diisi kecuali Middle Name!");
      return;
    }
    setAge(calculateAge(formData.birthdate));
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Form Data Diri</h2>
      <p>yang bertanda (*) wajib diisi</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>NPM *</Form.Label>
          <Form.Control
            type="text"
            name="npm"
            value={formData.npm}
            onChange={handleChange}
            placeholder="Masukkan NPM"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nama Depan *</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Masukkan Nama Depan"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nama Tengah *</Form.Label>
          <Form.Control
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Masukkan Nama Tengah"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nama Akhir *</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Masukkan Nama Akhir"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tanggal Lahir *</Form.Label>
          <Form.Control
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Data Diri</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>NPM:</strong> {formData.npm}</p>
          <p><strong>Nama Lengkap:</strong> {`${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim()}</p>
          <p><strong>Umur:</strong> {age} tahun</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FormDataDiri;
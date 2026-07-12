from image_gen.core import *
def test_tokenizer_and_conditioning():
    c=GeneratorConfig(); m=train(c); assert m["reconstruction_mse"]<.01
    v=generate(m,"vertical stripe",c); h=generate(m,"horizontal stripe",c)
    assert orientation_score(v)>.35; assert orientation_score(h)<-.35
def test_codes_in_range():
    c=GeneratorConfig(); x,_=make_data(c); cb=fit_codebook(x,c.codebook_size); z=encode(x,cb); assert z.min()==0; assert z.max()<c.codebook_size
